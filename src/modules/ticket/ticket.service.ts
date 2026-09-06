import { Exception } from '../../core'
import { mailService } from '../../utils/mail'
import { Type } from '../type/type.model'
import { User } from '../user/user.model'
import { TicketRepository } from './ticket.repository'

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

  async create(body: any) {
    if (!body.uid && !body.uuid) {
      body.uid = String(Math.floor(100000 + Math.random() * 900000))
    }

    const ticket = await repo.create(body)
    const created = await repo.findById(ticket.id)

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

  async update(body: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })

    const ticketBefore = await repo.findById(id)
    const oldAssignedTo = ticketBefore.assigned_to

    const ticket = await repo.update(body)

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
