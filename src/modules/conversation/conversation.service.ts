import { ConversationRepository } from './conversation.repository'
import { getPusher } from '../../utils/pusher'

const repo = new ConversationRepository()

export class ConversationService {
  findAll(query: any, tokenHolder?: any) {
    return repo.findAll(query, tokenHolder)
  }

  findById(id: number | string, tokenHolder?: any) {
    return repo.findById(id, tokenHolder)
  }

  async create(body: any, tokenHolder?: any) {
    const conversation = await repo.create(body, tokenHolder)
    try {
      if (conversation.ticket_id) {
        const pusher = getPusher()
        if (pusher) {
          const rawConv = typeof (conversation as any).toJSON === 'function' ? (conversation as any).toJSON() : conversation
          const channelName = `ticket.${conversation.ticket_id}`
          await pusher.trigger(channelName, 'ConversationCreated', {
            conversation: rawConv,
            ...rawConv,
          })
          console.log(`[Pusher] Broadcasted ConversationCreated to ${channelName}`)
        }
      }
    } catch (err) {
      console.error('[Pusher:ConversationCreated error]', err)
    }
    return conversation
  }

  update(body: any, tokenHolder?: any) {
    return repo.update(body, tokenHolder)
  }

  destroy(id: number | string, tokenHolder?: any) {
    return repo.destroy(id, tokenHolder)
  }

  async sendMessage(
    data: {
      conversation_id: number
      message: string
      user_id?: number
      contact_id?: number
      attachments?: Array<{ name?: string; path?: string; mime?: string; size?: number }>
    },
    tokenHolder?: any
  ) {
    const msg = await repo.sendMessage(data, tokenHolder)
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

  getMessages(conversationId: number | string, query: any = {}, tokenHolder?: any) {
    return repo.getMessages(conversationId, query, tokenHolder)
  }

  markRead(conversationId: number | string, userId?: number) {
    return repo.markRead(conversationId, userId)
  }
}
