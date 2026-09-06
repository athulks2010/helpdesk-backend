import { Op } from 'sequelize'
import { Exception } from '../../core'
import { Ticket } from './ticket.model'
import { TicketFavorite } from './ticket-favorite.model'
import { Comment } from './comment.model'
import { User } from '../user/user.model'
import { Contact } from '../contact/contact.model'
import { Status } from '../status/status.model'
import { Priority } from '../priority/priority.model'
import { Department } from '../department/department.model'
import { Type } from '../type/type.model'

const toId = (val: any): number | null => {
  if (val && typeof val === 'object') val = val.id ?? val.user_id
  if (val === undefined || val === null || val === '') return null
  const n = Number(val)
  return Number.isInteger(n) && n > 0 ? n : null
}

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
    if (payload.assignedTo !== undefined && payload.assigned_to === undefined) {
      payload.assigned_to = payload.assignedTo
    }
    if (payload.assignee_id !== undefined && payload.assigned_to === undefined) {
      payload.assigned_to = payload.assignee_id
    }
    if (payload.user && payload.user_id === undefined) {
      payload.user_id = payload.user.id ?? payload.user
    }
    if (payload.contact && payload.contact_id === undefined) {
      payload.contact_id = payload.contact.id ?? payload.contact
    }
    if (payload.user_id !== undefined) payload.user_id = toId(payload.user_id)
    if (payload.contact_id !== undefined) payload.contact_id = toId(payload.contact_id)
    if (payload.assigned_to !== undefined) payload.assigned_to = toId(payload.assigned_to)
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

  async getTicketRecipient(ticket: any) {
    const userId = toId(ticket.user_id)
    if (userId) {
      const user = await User.findByPk(userId)
      if (user?.email) {
        return {
          email: user.email,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
        }
      }
    }
    const contactId = toId(ticket.contact_id)
    if (contactId) {
      const contact = await Contact.findByPk(contactId)
      if (contact?.email) {
        return {
          email: contact.email,
          name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || contact.email,
        }
      }
    }
    if (ticket.email) {
      return { email: ticket.email, name: ticket.email }
    }
    return null
  }

  async getTicketEmail(ticket: any) {
    const recipient = await this.getTicketRecipient(ticket)
    return recipient?.email || null
  }

  async findById(id: number | string) {
    const ticket = await Ticket.findByPk(id, { include: defaultIncludes })
    if (!ticket) throw new Exception({ message: 'Ticket not found', httpResponseCode: 404 })
    return ticket
  }

  async create(body: any) {
    const payload = this.mapTicketPayload(body)
    const ticket = await Ticket.create(payload)
    return ticket
  }

  async update(body: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })
    const ticket = await this.findById(id)

    const payload = this.mapTicketPayload(body)
    await ticket.update(payload)

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

    return comment
  }

  async getComments(ticketId: number | string) {
    const items = await Comment.findAll({
      where: { ticket_id: ticketId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
      ],
      order: [['id', 'ASC']],
    })
    return { items, totalCount: items.length, message: 'Comments fetched successfully' }
  }

  async getFavorites(userId: number, ticketId?: number) {
    const whereClause: any = { user_id: userId }
    if (ticketId) whereClause.ticket_id = ticketId

    const favorites = await TicketFavorite.findAll({ where: whereClause })
    const ticketIds = favorites.map(f => f.ticket_id)
    if (ticketIds.length === 0) {
      if (ticketId) throw new Exception({ message: 'Favorite not found', httpResponseCode: 404 })
      return { items: [], totalCount: 0, message: 'Favorites fetched successfully' }
    }
    
    const { rows, count } = await Ticket.findAndCountAll({
      where: { id: ticketIds },
      include: defaultIncludes,
      order: [['id', 'DESC']]
    })
    
    if (ticketId) {
      if (rows.length === 0) throw new Exception({ message: 'Favorite not found', httpResponseCode: 404 })
      return { item: rows[0], message: 'Favorite fetched successfully' }
    }
    
    return { items: rows, totalCount: count, message: 'Favorites fetched successfully' }
  }

  async addFavorite(userId: number, ticketId: number) {
    if (!ticketId) throw new Exception({ message: 'Ticket ID is required', httpResponseCode: 422 })
    const exists = await TicketFavorite.findOne({ where: { user_id: userId, ticket_id: ticketId } })
    if (exists) return { message: 'Already in favorites' }
    await TicketFavorite.create({ user_id: userId, ticket_id: ticketId })
    return { message: 'Added to favorites' }
  }

  async removeFavorite(userId: number, ticketId: number) {
    if (!ticketId) throw new Exception({ message: 'Ticket ID is required', httpResponseCode: 422 })
    await TicketFavorite.destroy({ where: { user_id: userId, ticket_id: ticketId } })
    return { message: 'Removed from favorites' }
  }
}
