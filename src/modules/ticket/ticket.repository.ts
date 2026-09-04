import { Op } from 'sequelize'
import { Exception } from '../../core'
import { Ticket } from './ticket.model'
import { Comment } from './comment.model'

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

    const include: any[] = []
    // Optional includes can be passed from service when associations are ready
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

  async findById(id: number | string) {
    const ticket = await Ticket.findByPk(id)
    if (!ticket) throw new Exception({ message: 'Ticket not found', httpResponseCode: 404 })
    return ticket
  }

  async create(body: any) {
    const payload = this.mapTicketPayload(body)
    if (!payload.uid) {
      payload.uid = String(Math.floor(100000 + Math.random() * 900000))
    }
    return Ticket.create(payload)
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
    return Comment.create(payload)
  }

  async getComments(ticketId: number | string) {
    const items = await Comment.findAll({
      where: { ticket_id: ticketId },
      order: [['id', 'ASC']],
    })
    return { items, totalCount: items.length, message: 'Comments fetched successfully' }
  }
}
