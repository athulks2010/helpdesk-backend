import { TicketFieldService } from './ticket-field.service'

export class TicketFieldController {
  private service = new TicketFieldService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { item, message: 'Ticket field fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { item, message: 'Ticket field created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { item, message: 'Ticket field updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { item, message: 'Ticket field deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { item, message: 'Ticket field restored successfully' }
  }
}
