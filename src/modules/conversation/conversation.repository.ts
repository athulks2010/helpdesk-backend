import { Op } from 'sequelize'
import { Exception } from '../../core'
import { Conversation } from './conversation.model'
import { Message } from './message.model'
import { Participant } from './participant.model'
import { MessageAttachment } from './message-attachment.model'
import { User } from '../user/user.model'
import { Contact } from '../contact/contact.model'
import { mailService } from '../../utils/mail'

export class ConversationRepository {
  async findAll(query: any = {}) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 20
    const offset = (pageNumber - 1) * pageSize
    const where: any = {}

    if (query.ticket_id) where.ticket_id = query.ticket_id
    if (query.contact_id) where.contact_id = query.contact_id
    if (query.searchText) {
      where.title = { [Op.like]: `%${query.searchText}%` }
    }

    const sortField = query.sortField || 'id'
    const sortOrder = (query.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const { rows, count } = await Conversation.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [[sortField, sortOrder]],
    })

    return { items: rows, totalCount: count, message: 'Conversations fetched successfully' }
  }

  mapPayload(body: any) {
    const payload = { ...body }
    if (payload.subject !== undefined && payload.title === undefined) {
      payload.title = payload.subject
    }
    delete payload.subject
    return payload
  }

  async findById(id: number | string) {
    const item = await Conversation.findByPk(id)
    if (!item) throw new Exception({ message: 'Conversation not found', httpResponseCode: 404 })
    return item
  }

  private async getParticipantEmail(p: any) {
    if (p.user_id) {
      const user = await User.findByPk(p.user_id)
      return user?.email
    }
    if (p.contact_id) {
      const contact = await Contact.findByPk(p.contact_id)
      return contact?.email
    }
    return null
  }

  private async getConversationParticipantsEmails(conversationId: number) {
    const participants = await Participant.findAll({ where: { conversation_id: conversationId } })
    const emails: string[] = []
    for (const p of participants) {
      const email = await this.getParticipantEmail(p)
      if (email) emails.push(email)
    }
    return emails
  }

  async create(body: any) {
    const payload = this.mapPayload(body)
    const conversation = await Conversation.create(payload)
    if (body.participants && Array.isArray(body.participants)) {
      for (const p of body.participants) {
        await Participant.create({
          conversation_id: conversation.id,
          user_id: p.user_id,
          contact_id: p.contact_id,
        })
        try {
          const email = await this.getParticipantEmail(p)
          if (email) {
            await mailService.sendTemplate('conversation_created', email, {
              title: conversation.title,
              conversation_id: conversation.id,
            })
          }
        } catch (err) {
          console.error('[ConvRepo:create mail]', err)
        }
      }
    }
    return conversation
  }

  async update(body: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })
    const item = await this.findById(id)
    const payload = this.mapPayload(body)
    await item.update(payload)
    return item
  }

  async destroy(id: number | string) {
    const item = await this.findById(id)
    await item.destroy()
    return item
  }

  async sendMessage(data: {
    conversation_id: number
    message: string
    user_id?: number
    contact_id?: number
    attachments?: Array<{ name?: string; path?: string; mime?: string; size?: number; filename?: string; file_path?: string; mime_type?: string; file_size?: number }>
  }) {
    const msg = await Message.create({
      conversation_id: data.conversation_id,
      message: data.message,
      user_id: data.user_id,
      contact_id: data.contact_id,
      is_read: false,
    })
    if (data.attachments?.length) {
      for (const a of data.attachments) {
        await MessageAttachment.create({
          message_id: msg.id,
          filename: a.filename || a.name || 'file',
          file_path: a.file_path || a.path || '',
          mime_type: a.mime_type || a.mime || 'application/octet-stream',
          file_size: a.file_size || a.size || 0,
        })
      }
    }

    try {
      const emails = await this.getConversationParticipantsEmails(data.conversation_id)
      for (const email of emails) {
        await mailService.sendTemplate('conversation_new_message', email, {
          message: data.message,
          conversation_id: data.conversation_id,
        })
      }
    } catch (err) {
      console.error('[ConvRepo:sendMessage mail]', err)
    }

    return msg
  }

  async getMessages(conversationId: number | string, query: any = {}) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 50
    const offset = (pageNumber - 1) * pageSize

    const { rows, count } = await Message.findAndCountAll({
      where: { conversation_id: conversationId },
      limit: pageSize,
      offset,
      order: [['id', 'ASC']],
    })

    return { items: rows, totalCount: count, message: 'Messages fetched successfully' }
  }

  async markRead(conversationId: number | string, userId?: number) {
    const where: any = { conversation_id: conversationId, is_read: false }
    await Message.update({ is_read: true }, { where })
    return { message: 'Messages marked as read', conversation_id: conversationId, user_id: userId }
  }
}
