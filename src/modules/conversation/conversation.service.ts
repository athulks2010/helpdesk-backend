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
        const rawJson: any = typeof (msg as any).toJSON === 'function' ? (msg as any).toJSON() : msg
        const payload = {
          chatMessage: {
            id: rawJson.id,
            message: rawJson.message,
            conversation_id: rawJson.conversation_id,
            user_id: rawJson.user_id,
            contact_id: rawJson.contact_id,
            created_at: rawJson.created_at || rawJson.createdAt,
            updated_at: rawJson.updated_at || rawJson.updatedAt,
            user: rawJson.user
              ? {
                  id: rawJson.user.id,
                  first_name: rawJson.user.first_name,
                  last_name: rawJson.user.last_name,
                  email: rawJson.user.email,
                  photo: rawJson.user.photo_path || null,
                }
              : null,
            contact: rawJson.contact
              ? {
                  id: rawJson.contact.id,
                  first_name: rawJson.contact.first_name,
                  last_name: rawJson.contact.last_name,
                  email: rawJson.contact.email,
                }
              : null,
            attachments: rawJson.attachments || [],
          },
          ...rawJson,
        }

        const channelName = `chat.${data.conversation_id}`
        const res = await pusher.trigger(channelName, 'NewChatMessage', payload)
        console.log(`[Pusher] Broadcasted NewChatMessage to ${channelName}: status ${res.status}`)
      } else {
        console.warn('[Pusher] Client not initialized. Check PUSHER_APP_KEY in settings or env.')
      }
    } catch (err) {
      console.error('[Pusher:sendMessage broadcast error]', err)
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
