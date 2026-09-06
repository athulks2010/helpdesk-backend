import { Exception } from '../../core'
import { mailService } from '../../utils/mail'
import { TicketFieldService } from '../ticket-field/ticket-field.service'
import { Type } from '../type/type.model'
import { User } from '../user/user.model'
import {
  logTicketAssignment,
  logTicketComment,
  logTicketCreated,
  logTicketFieldChange,
  logTicketStatusChange,
} from './ticket-activity.model'
import { TicketRepository } from './ticket.repository'

const fieldService = new TicketFieldService()
const TRACKED_FIELDS = [
  'status_id',
  'assigned_to',
  'priority_id',
  'department_id',
  'category_id',
  'type_id',
  'subject',
  'details',
]

const extractCustomInputs = (body: any) => {
  const raw = body?.custom_field ?? body?.custom_fields
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return typeof raw === 'object' && !Array.isArray(raw) ? raw : null
}

const repo = new TicketRepository()

const toId = (val: any): number | null => {
  if (val && typeof val === 'object') val = val.id ?? val.user_id
  if (val === undefined || val === null || val === '') return null
  const n = Number(val)
  return Number.isInteger(n) && n > 0 ? n : null
}

export class TicketService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  async create(body: any, tokenHolder?: any) {
    if (!body.uid && !body.uuid) {
      body.uid = String(Math.floor(100000 + Math.random() * 900000))
    }

    const customInputs = extractCustomInputs(body)
    const ticket = await repo.create(body)
    if (customInputs) {
      await fieldService.persistEntries(ticket.id, customInputs)
    }
    const created = await repo.findById(ticket.id)
    try {
      await logTicketCreated(created, tokenHolder?.id)
    } catch (err) {
      console.error('[TicketService:create activity]', err)
    }

    try {
      const sent = new Set<string>()
      const data = await this.ticketMailData(created)
      const createSlug =
        body.source === 'public' ? 'create_ticket_new_customer' : 'create_ticket_dashboard'

      const requester = await repo.getTicketRecipient(created)
      if (requester?.email) {
        await mailService.sendTemplate(createSlug, requester.email, {
          ...data,
          name: requester.name,
          email: requester.email,
        })
        sent.add(requester.email.toLowerCase())
      }

      const assignedTo = toId(created.assigned_to) || toId(body.assigned_to)
      if (assignedTo) {
        const assignee = await User.findByPk(assignedTo)
        if (assignee?.email && !sent.has(assignee.email.toLowerCase())) {
          await mailService.sendTemplate('assigned_ticket', assignee.email, {
            ...data,
            name: `${assignee.first_name || ''} ${assignee.last_name || ''}`.trim(),
            email: assignee.email,
          })
          sent.add(assignee.email.toLowerCase())
        }
      }

      const admins = await User.findAll({ where: { role_id: 1 } })
      for (const admin of admins) {
        if (!admin.email || sent.has(admin.email.toLowerCase())) continue
        await mailService.sendTemplate(createSlug, admin.email, {
          ...data,
          name: `${admin.first_name || ''} ${admin.last_name || ''}`.trim(),
          email: admin.email,
        })
        sent.add(admin.email.toLowerCase())
      }
    } catch (err) {
      console.error('[TicketService:create mail]', err)
    }

    return created
  }

  async update(body: any, tokenHolder?: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })

    const ticketBefore = await repo.findById(id)
    const oldAssignedTo = ticketBefore.assigned_to
    const beforeValues: Record<string, any> = {}
    for (const field of TRACKED_FIELDS) {
      beforeValues[field] = (ticketBefore as any)[field]
    }

    const customInputs = extractCustomInputs(body)
    await repo.update(body)
    if (customInputs) {
      await fieldService.persistEntries(Number(id), customInputs, true)
    }
    const ticket = await repo.findById(id)

    try {
      await this.logTicketUpdates(ticket, beforeValues, body, tokenHolder?.id)
    } catch (err) {
      console.error('[TicketService:update activity]', err)
    }

    try {
      const data = await this.ticketMailData(ticket)
      const newAssignedTo = toId(body.assigned_to)
      const previousAssignedTo = toId(oldAssignedTo)
      if (newAssignedTo && newAssignedTo !== previousAssignedTo) {
        const assignee = await User.findByPk(newAssignedTo)
        if (assignee?.email) {
          await mailService.sendTemplate('assigned_ticket', assignee.email, {
            ...data,
            name: `${assignee.first_name || ''} ${assignee.last_name || ''}`.trim(),
            email: assignee.email,
          })
        }
      }

      const requester = await repo.getTicketRecipient(ticket)
      if (requester?.email) {
        await mailService.sendTemplate('ticket_updated', requester.email, {
          ...data,
          name: requester.name,
          email: requester.email,
        })
      }
    } catch (err) {
      console.error('[TicketService:update mail]', err)
    }

    return ticket
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }

  async addComment(data: { ticket_id: number; body?: string; details?: string; user_id?: number; contact_id?: number }) {
    const comment = await repo.addComment(data)
    try {
      const ticket = await repo.findById(data.ticket_id)
      await logTicketComment(ticket, comment.id, data.user_id)
    } catch (err) {
      console.error('[TicketService:comment activity]', err)
    }

    try {
      const ticket = await repo.findById(data.ticket_id)
      const email = await repo.getTicketEmail(ticket)
      if (email) {
        await mailService.sendTemplate('ticket_new_comment', email, {
          uid: ticket.uid,
          subject: ticket.subject,
          type: (ticket as any).type?.name,
          name: (ticket as any).user?.first_name || (ticket as any).contact?.first_name || '',
          url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
          comment: (comment as any).details || '',
        })
      }
    } catch (err) {
      console.error('[TicketService:comment mail]', err)
    }

    return comment
  }

  getComments(ticketId: number | string) {
    return repo.getComments(ticketId)
  }

  getFavorites(userId: number, ticketId?: number) {
    return repo.getFavorites(userId, ticketId)
  }

  addFavorite(userId: number, ticketId: number) {
    return repo.addFavorite(userId, ticketId)
  }

  removeFavorite(userId: number, ticketId: number) {
    return repo.removeFavorite(userId, ticketId)
  }

  getActivities(ticketId: number | string) {
    return repo.getActivities(ticketId)
  }

  private async logTicketUpdates(ticket: any, beforeValues: Record<string, any>, body: any, userId?: number) {
    for (const field of TRACKED_FIELDS) {
      if (body[field] === undefined && !(field === 'details' && body.body !== undefined)) continue
      const oldVal = field.endsWith('_id') || field === 'assigned_to' ? toId(beforeValues[field]) : beforeValues[field]
      const newVal = field.endsWith('_id') || field === 'assigned_to' ? toId(ticket[field]) : ticket[field]
      if (String(oldVal ?? '') === String(newVal ?? '')) continue
      if (field === 'assigned_to') {
        await logTicketAssignment(ticket, oldVal, newVal, userId)
      } else if (field === 'status_id') {
        await logTicketStatusChange(ticket, oldVal, newVal, userId)
      } else {
        await logTicketFieldChange(ticket, field, oldVal, newVal, userId)
      }
    }
  }

  private async ticketMailData(ticket: any) {
    let typeName = ticket?.type?.name
    if (!typeName && ticket?.type_id) {
      const type = await Type.findByPk(ticket.type_id)
      typeName = type?.name
    }
    return {
      uid: ticket.uid,
      subject: ticket.subject,
      type: typeName || '',
      url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
    }
  }
}
