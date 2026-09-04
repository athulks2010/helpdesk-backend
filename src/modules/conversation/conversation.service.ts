import { ConversationRepository } from './conversation.repository'
import { getPusher } from '../../utils/pusher'

const repo = new ConversationRepository()

export class ConversationService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  create(body: any) {
    return repo.create(body)
  }

  update(body: any) {
    return repo.update(body)
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  async sendMessage(data: {
    conversation_id: number
    message: string
    user_id?: number
    contact_id?: number
    attachments?: Array<{ name?: string; path?: string; mime?: string; size?: number }>
  }) {
    const msg = await repo.sendMessage(data)
    try {
      const pusher = getPusher()
      if (pusher) {
        await pusher.trigger(`chat.${data.conversation_id}`, 'NewChatMessage', msg.toJSON())
      }
    } catch {
      /* pusher optional */
    }
    return msg
  }

  getMessages(conversationId: number | string, query: any = {}) {
    return repo.getMessages(conversationId, query)
  }

  markRead(conversationId: number | string, userId?: number) {
    return repo.markRead(conversationId, userId)
  }
}
