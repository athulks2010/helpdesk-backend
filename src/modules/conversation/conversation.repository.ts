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
  private isCustomerUser(tokenHolder?: any): boolean {
    if (!tokenHolder) return false
    const roleId = Number(tokenHolder.role_id ?? tokenHolder.role?.id)
    const roleName = String(tokenHolder.role?.name || tokenHolder.role?.slug || '').toLowerCase()
    return roleId === 2 || roleName === 'customer'
  }

  async checkAccess(conversation: Conversation, tokenHolder?: any) {
    if (!tokenHolder) return
    const userId = tokenHolder.id
    const isCustomer = this.isCustomerUser(tokenHolder)

    // Customer can NEVER access internal conversations
    if (isCustomer && conversation.type === 'internal') {
      throw new Exception({
        message: 'You are not authorized to access this internal conversation',
        httpResponseCode: 403,
      })
    }

    // Admin has access to everything
    const roleId = Number(tokenHolder.role_id ?? tokenHolder.role?.id)
    const roleName = String(tokenHolder.role?.name || tokenHolder.role?.slug || '').toLowerCase()
    if (roleId === 1 || roleName === 'admin' || roleName === 'super admin') {
      return
    }

    // Creator has access
    if (conversation.created_by && Number(conversation.created_by) === Number(userId)) {
      return
    }

    // Staff/Agent has access to internal conversations
    if (!isCustomer && conversation.type === 'internal') {
      return
    }

    // Customer or contact match
    if (tokenHolder.contact_id && Number(conversation.contact_id) === Number(tokenHolder.contact_id)) {
      return
    }

    // Participant check
    const participant = await Participant.findOne({
      where: {
        conversation_id: conversation.id,
        [Op.or]: [
          { user_id: userId },
          ...(tokenHolder.contact_id ? [{ contact_id: tokenHolder.contact_id }] : []),
        ],
      },
    })
    if (participant) return

    // Staff member accessing customer conversation
    if (!isCustomer) {
      return
    }

    throw new Exception({
      message: 'You are not authorized to access this conversation',
      httpResponseCode: 403,
    })
  }

  async findAll(query: any = {}, tokenHolder?: any) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 20
    const offset = (pageNumber - 1) * pageSize
    const where: any = {}

    // Filter by type if provided
    if (query.type) {
      where.type = query.type
    }

    // Access control: if customer, strictly filter to customer type and their conversations
    const isCustomer = this.isCustomerUser(tokenHolder)
    if (isCustomer) {
      where.type = 'customer'
      const myParticipants = await Participant.findAll({
        where: {
          [Op.or]: [
            { user_id: tokenHolder.id },
            ...(tokenHolder.contact_id ? [{ contact_id: tokenHolder.contact_id }] : []),
          ],
        },
        attributes: ['conversation_id'],
      })
      const myConvIds = myParticipants.map((p) => p.conversation_id).filter(Boolean)

      where[Op.and] = [
        where[Op.and] || {},
        {
          [Op.or]: [
            { created_by: tokenHolder.id },
            ...(tokenHolder.contact_id ? [{ contact_id: tokenHolder.contact_id }] : []),
            ...(myConvIds.length ? [{ id: { [Op.in]: myConvIds } }] : []),
          ],
        },
      ]
    }

    if (query.ticket_id) where.ticket_id = query.ticket_id
    if (query.contact_id) where.contact_id = query.contact_id
    if (query.searchText) {
      where.title = { [Op.like]: `%${query.searchText}%` }
    }

    const sortField = query.sortField || 'id'
    const sortOrder = (query.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const { rows, count } = await Conversation.findAndCountAll({
      where,
      include: [
        {
          model: Participant,
          as: 'participants',
          include: [
            { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
            { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
          ],
        },
        { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
      ],
      limit: pageSize,
      offset,
      order: [[sortField, sortOrder]],
      distinct: true,
    })

    return { items: rows, totalCount: count, message: 'Conversations fetched successfully' }
  }

  mapPayload(body: any) {
    const payload = { ...body }
    if (payload.subject !== undefined && payload.title === undefined) {
      payload.title = payload.subject
    }
    delete payload.subject
    if (payload.conversation_type && !payload.type) {
      payload.type = payload.conversation_type
    }
    delete payload.conversation_type
    return payload
  }

  async findById(id: number | string, tokenHolder?: any) {
    const item = await Conversation.findByPk(id, {
      include: [
        {
          model: Participant,
          as: 'participants',
          include: [
            { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
            { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
          ],
        },
        { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
      ],
    })
    if (!item) throw new Exception({ message: 'Conversation not found', httpResponseCode: 404 })

    if (tokenHolder) {
      await this.checkAccess(item, tokenHolder)
    }

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

  async create(body: any, tokenHolder?: any) {
    const payload = this.mapPayload(body)
    const creatorId = tokenHolder?.id || body.created_by
    if (creatorId) {
      payload.created_by = creatorId
    }

    // If customer user is creating, force type to customer
    if (this.isCustomerUser(tokenHolder)) {
      payload.type = 'customer'
    } else {
      payload.type = payload.type || 'internal'
    }

    const conversation = await Conversation.create(payload)

    // Auto-enroll creator as participant if not already present
    const participantsList = Array.isArray(body.participants) ? [...body.participants] : []
    if (creatorId && !participantsList.some((p) => String(p.user_id) === String(creatorId))) {
      participantsList.push({
        user_id: creatorId,
        contact_id: body.contact_id,
      })
    }

    for (const p of participantsList) {
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

    // If initial_message is provided, create it and trigger broadcast
    const initMsg = body.initial_message || body.message || body.body
    if (initMsg && typeof initMsg === 'string' && initMsg.trim()) {
      try {
        await this.sendMessage({
          conversation_id: conversation.id,
          message: initMsg.trim(),
          user_id: creatorId,
          contact_id: body.contact_id,
        })
      } catch (err) {
        console.error('[ConvRepo:create initial message error]', err)
      }
    }

    return this.findById(conversation.id)
  }

  async update(body: any, tokenHolder?: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })
    const item = await this.findById(id, tokenHolder)
    const payload = this.mapPayload(body)
    await item.update(payload)
    return item
  }

  async destroy(id: number | string, tokenHolder?: any) {
    const item = await this.findById(id, tokenHolder)
    await item.destroy()
    return item
  }

  async sendMessage(
    data: {
      conversation_id: number
      message: string
      user_id?: number
      contact_id?: number
      attachments?: Array<{ name?: string; path?: string; mime?: string; size?: number; filename?: string; file_path?: string; mime_type?: string; file_size?: number }>
    },
    tokenHolder?: any
  ) {
    if (tokenHolder) {
      await this.findById(data.conversation_id, tokenHolder)
    }

    const msg = await Message.create({
      conversation_id: data.conversation_id,
      message: data.message,
      user_id: data.user_id,
      contact_id: data.contact_id,
      is_read: false,
    })

    await Conversation.update(
      { last_message_at: new Date(), last_activity: new Date() },
      { where: { id: data.conversation_id } }
    )

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

    const fullMsg = await Message.findByPk(msg.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
        { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: MessageAttachment, as: 'attachments' },
      ],
    })

    return fullMsg || msg
  }

  async getMessages(conversationId: number | string, query: any = {}, tokenHolder?: any) {
    if (tokenHolder) {
      await this.findById(conversationId, tokenHolder)
    }

    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 50
    const offset = (pageNumber - 1) * pageSize

    const { rows, count } = await Message.findAndCountAll({
      where: { conversation_id: conversationId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
        { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: MessageAttachment, as: 'attachments' },
      ],
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
