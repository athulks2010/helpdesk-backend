import { ConversationService } from './conversation.service'

export class ConversationController {
  private service = new ConversationService()

  async all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { item, message: 'Conversation fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { item, message: 'Conversation created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { item, message: 'Conversation updated successfully' }
  }

  async destroy(query: any) {
    const item = await this.service.destroy(query.id)
    return { item, message: 'Conversation deleted successfully' }
  }

  async sendMessage(body: any, tokenHolder?: any) {
    const item = await this.service.sendMessage({
      conversation_id: body.conversation_id,
      message: body.message,
      user_id: body.user_id || tokenHolder?.id,
      contact_id: body.contact_id,
      attachments: body.attachments,
    })
    return { item, message: 'Message sent successfully' }
  }

  async getMessages(query: any) {
    return this.service.getMessages(query.conversation_id || query.id, query)
  }

  async markRead(body: any, tokenHolder?: any) {
    return this.service.markRead(body.conversation_id || body.id, body.user_id || tokenHolder?.id)
  }
}
