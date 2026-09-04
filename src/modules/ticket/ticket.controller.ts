import { TicketService } from './ticket.service'

export class TicketController {
  private service = new TicketService()

  async all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { item, message: 'Ticket fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { item, message: 'Ticket created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { item, message: 'Ticket updated successfully' }
  }

  async destroy(query: any) {
    const item = await this.service.destroy(query.id)
    return { item, message: 'Ticket deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { item, message: 'Ticket restored successfully' }
  }

  async addComment(body: any, tokenHolder?: any) {
    const item = await this.service.addComment({
      ticket_id: body.ticket_id,
      body: body.body,
      user_id: body.user_id || tokenHolder?.id,
      contact_id: body.contact_id,
    })
    return { item, message: 'Comment added successfully' }
  }

  async getComments(query: any) {
    return this.service.getComments(query.ticket_id || query.id)
  }
}
