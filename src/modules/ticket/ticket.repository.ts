import { Op } from 'sequelize'
import { Exception } from '../../core'
import { Ticket } from './ticket.model'
import { Comment } from './comment.model'
import { User } from '../user/user.model'
import { Contact } from '../contact/contact.model'
import { Status } from '../status/status.model'
import { Priority } from '../priority/priority.model'
import { Department } from '../department/department.model'
import { Type } from '../type/type.model'
import { mailService } from '../../utils/mail'

const defaultIncludes = [
  { model: Status, as: 'status', attributes: ['id', 'name'] },
  { model: Priority, as: 'priority', attributes: ['id', 'name'] },
  { model: Department, as: 'department', attributes: ['id', 'name'] },
  { model: Type, as: 'type', attributes: ['id', 'name'] },
  { model: User, as: 'assignedTo', attributes: ['id', 'first_name', 'last_name', 'email'] },
  { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
  { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
]

export class TicketRepository {
  async findAll(query: any = {}) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 20
    const offset = (pageNumber - 1) * pageSize
    const where: any = {}

    if (query.status_id) where.status_id = query.status_id
    if (query.priority_id) where.priority_id = query.priority_id
    if (query.department_id) where.department_id = query.department_id
    if (query.assigned_to) where.assigned_to = query.assigned_to
    if (query.user_id) where.user_id = query.user_id
    if (query.searchText) {
      where[Op.or] = [
        { subject: { [Op.like]: `%${query.searchText}%` } },
        { uid: { [Op.like]: `%${query.searchText}%` } },
        { details: { [Op.like]: `%${query.searchText}%` } },
      ]
    }

    const sortField = query.sortField || 'id'
    const sortOrder = (query.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const include: any[] = [...defaultIncludes]
    if (query.includes && Array.isArray(query.includes)) {
      include.push(...query.includes)
    }

    const { rows, count } = await Ticket.findAndCountAll({
      where,
      include,
      limit: pageSize,
      offset,
      order: [[sortField, sortOrder]],
      distinct: true,
    })

    return { items: rows, totalCount: count, message: 'Tickets fetched successfully' }
  }

  mapTicketPayload(body: any) {
    const payload = { ...body }
    if (payload.uuid !== undefined && payload.uid === undefined) {
      payload.uid = payload.uuid
    }
    if (payload.body !== undefined && payload.details === undefined) {
      payload.details = payload.body
    }
    if (payload.closed_at !== undefined && payload.close === undefined) {
      payload.close = payload.closed_at
    }
    if (payload.first_response_at !== undefined && payload.response === undefined) {
      payload.response = payload.first_response_at
    }
    if (payload.impact !== undefined && payload.impact_level === undefined) {
      payload.impact_level = payload.impact
    }
    if (payload.urgency !== undefined && payload.urgency_level === undefined) {
      payload.urgency_level = payload.urgency
    }
    if (payload.resolve_by !== undefined && payload.due === undefined) {
      payload.due = payload.resolve_by
    }
    if (payload.custom_field !== undefined && payload.custom_fields === undefined) {
      payload.custom_fields = payload.custom_field
    }
    delete payload.uuid
    delete payload.body
    delete payload.closed_at
    delete payload.first_response_at
    delete payload.impact
    delete payload.urgency
    delete payload.resolve_by
    delete payload.custom_field
    return payload
  }

  private async getTicketEmail(ticket: any) {
    if (ticket.user_id) {
      const user = await User.findByPk(ticket.user_id)
      return user?.email
    }
    if (ticket.contact_id) {
      const contact = await Contact.findByPk(ticket.contact_id)
      return contact?.email
    }
    return null
  }

  async findById(id: number | string) {
    const ticket = await Ticket.findByPk(id, { include: defaultIncludes })
    if (!ticket) throw new Exception({ message: 'Ticket not found', httpResponseCode: 404 })
    return ticket
  }

  async create(body: any) {
    const payload = this.mapTicketPayload(body)
    if (!payload.uid) {
      payload.uid = String(Math.floor(100000 + Math.random() * 900000))
    }
    const ticket = await Ticket.create(payload)

    try {
      const email = await this.getTicketEmail(ticket)
      if (email) {
        await mailService.sendTemplate('create_ticket_new_customer', email, {
          ticket_id: ticket.uid,
          subject: ticket.subject,
        })
      }
    } catch (err) {
      console.error('[TicketRepo:create mail]', err)
    }

    return ticket
  }

  async update(body: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })
    const ticket = await this.findById(id)
    
    const oldAssignedTo = ticket.assigned_to

    const payload = this.mapTicketPayload(body)
    await ticket.update(payload)

    try {
      if (payload.assigned_to && payload.assigned_to !== oldAssignedTo) {
        const assignee = await User.findByPk(payload.assigned_to)
        if (assignee && assignee.email) {
          await mailService.sendTemplate('assigned_ticket', assignee.email, {
            ticket_id: ticket.uid,
            subject: ticket.subject,
          })
        }
      }

      const email = await this.getTicketEmail(ticket)
      if (email) {
        await mailService.sendTemplate('ticket_updated', email, {
          ticket_id: ticket.uid,
          subject: ticket.subject,
        })
      }
    } catch (err) {
      console.error('[TicketRepo:update mail]', err)
    }

    return ticket
  }

  async destroy(id: number | string) {
    const ticket = await this.findById(id)
    await ticket.destroy()
    return ticket
  }

  async restore(id: number | string) {
    const ticket = await Ticket.findByPk(id, { paranoid: false })
    if (!ticket) throw new Exception({ message: 'Ticket not found', httpResponseCode: 404 })
    await ticket.restore()
    return ticket
  }

  async addComment(data: { ticket_id: number; body?: string; details?: string; user_id?: number; contact_id?: number }) {
    const payload: any = { ...data }
    if (payload.body !== undefined && payload.details === undefined) {
      payload.details = payload.body
    }
    delete payload.body
    const comment = await Comment.create(payload)

    try {
      const ticket = await this.findById(payload.ticket_id)
      const email = await this.getTicketEmail(ticket)
      if (email) {
        await mailService.sendTemplate('ticket_new_comment', email, {
          ticket_id: ticket.uid,
          subject: ticket.subject,
          comment: payload.details,
        })
      }
    } catch (err) {
      console.error('[TicketRepo:comment mail]', err)
    }

    return comment
  }

  async getComments(ticketId: number | string) {
    const items = await Comment.findAll({
      where: { ticket_id: ticketId },
      order: [['id', 'ASC']],
    })
    return { items, totalCount: items.length, message: 'Comments fetched successfully' }
  }
}
