import { Router } from '../../core'
import { Faq } from '../faq/faq.model'
import { Post } from '../post/post.model'
import { Type } from '../type/type.model'
import { KnowledgeBase } from '../knowledge-base/knowledge-base.model'
import { Service } from '../service/service.model'
import { FrontPage } from '../front-page/front-page.model'
import { TicketService } from '../ticket/ticket.service'
import { Conversation } from '../conversation/conversation.model'
import { Message } from '../conversation/message.model'
import { Participant } from '../conversation/participant.model'
import { MessageAttachment } from '../conversation/message-attachment.model'
import { Contact } from '../contact/contact.model'
import { User } from '../user/user.model'
import { getPusher } from '../../utils/pusher'

/** Public landing / open-ticket / chat init (no auth) */
export const publicRouter = new Router()

publicRouter.get('/faqs', async () => {
  const items = await Faq.findAll({ order: [['id', 'ASC']] })
  return { items, totalCount: items.length, message: 'OK' }
})

publicRouter.get('/posts', async (req) => {
  const items = await Post.findAll({
    limit: Number(req.query.pageSize || 15),
    order: [['id', 'DESC']],
  })
  return { items, totalCount: items.length, message: 'OK' }
})

publicRouter.get('/posts/single', async (req) => {
  const row = await Post.findOne({
    where: req.query.slug ? { slug: String(req.query.slug) } : { id: Number(req.query.id) },
  })
  return { ...(row?.toJSON() || {}), message: 'OK' }
})

publicRouter.get('/knowledge-base', async () => {
  const items = await KnowledgeBase.findAll({
    include: [{ model: Type, as: 'type' }],
    order: [['id', 'ASC']],
  })
  return { items, totalCount: items.length, message: 'OK' }
})

publicRouter.get('/services', async () => {
  const items = await Service.findAll({ order: [['id', 'ASC']] })
  return { items, totalCount: items.length, message: 'OK' }
})

publicRouter.get('/front-page', async (req) => {
  const slug = String(req.query.slug || 'home')
  const row = await FrontPage.findOne({ where: { slug } })
  return { ...(row?.toJSON() || {}), message: 'OK' }
})

publicRouter.post('/ticket/open', async (req) => {
  const body = req.body || {}
  const password = Math.random().toString(36).slice(-8)
  const ticket = await new TicketService().create({
    subject: body.subject,
    details: body.details || body.body || body.message,
    user_id: body.user_id,
    contact_id: body.contact_id,
    email: body.email,
    status_id: body.status_id,
    priority_id: body.priority_id,
    department_id: body.department_id,
    category_id: body.category_id,
    type_id: body.type_id,
    source: 'public',
    password,
  })
  return { ...ticket.toJSON(), message: 'Ticket opened' }
})

publicRouter.post('/subscribe/news', async (req) => {
  return { email: req.body?.email, message: 'Subscribed' }
})

publicRouter.post('/chat/init', async (req) => {
  const body = req.body || {}
  let contact = null as Contact | null
  if (body.email) {
    contact = await Contact.findOne({ where: { email: body.email } })
    if (!contact) {
      contact = await Contact.create({
        first_name: body.first_name || 'Guest',
        last_name: body.last_name || '',
        email: body.email,
        phone: body.phone,
      } as any)
    }
  }

  // Flow B Parity: Check if contact already has an active conversation
  let conversation = null as Conversation | null
  if (contact) {
    conversation = await Conversation.findOne({
      where: { contact_id: contact.id, status: 'active' },
      order: [['id', 'DESC']],
    })
  }

  if (!conversation) {
    conversation = await Conversation.create({
      contact_id: contact?.id,
      title: body.subject || body.title || 'Live Support Chat',
      type: 'customer',
      source: 'website',
      status: 'active',
      priority: body.priority || 'medium',
      department: body.department || 'general',
    } as any)

    // Assign available admin to Participant
    const admin = await User.findOne({ where: { role_id: 1 } })
    if (admin) {
      await Participant.create({
        conversation_id: conversation.id,
        user_id: admin.id,
        contact_id: contact?.id,
      } as any)
    }

    // Auto welcome message
    const welcomeMsg = await Message.create({
      conversation_id: conversation.id,
      message: 'Hello! Welcome to our support chat. An agent will be with you shortly.',
      is_read: false,
      user_id: admin?.id,
    } as any)

    const pusher = getPusher()
    if (pusher) {
      const payload = {
        chatMessage: {
          id: welcomeMsg.id,
          conversation_id: conversation.id,
          message: welcomeMsg.message,
          created_at: (welcomeMsg as any).createdAt || new Date().toISOString(),
          user: admin ? { id: admin.id, first_name: admin.first_name, last_name: admin.last_name } : null,
          contact: null,
          attachments: [],
        },
        ...welcomeMsg.toJSON(),
      }
      try {
        await pusher.trigger(`chat.${conversation.id}`, 'NewChatMessage', payload)
      } catch (e) {
        /* silent */
      }
    }
  }

  return {
    conversation: conversation.toJSON(),
    contact: contact?.toJSON(),
    message: 'Chat initialized',
  }
})

publicRouter.get('/chat/conversation', async (req) => {
  const id = Number(req.query.id)
  const conversation = await Conversation.findByPk(id)
  const messages = await Message.findAll({
    where: { conversation_id: id },
    include: [
      { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
      { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
      { model: MessageAttachment, as: 'attachments' },
    ],
    order: [['id', 'ASC']],
  })
  return { conversation, messages, message: 'OK' }
})

publicRouter.post('/chat/send-message', async (req) => {
  const body = req.body || {}
  const msg = await Message.create({
    conversation_id: body.conversation_id,
    contact_id: body.contact_id,
    message: body.message,
    is_read: false,
  } as any)

  await Conversation.update(
    { last_message_at: new Date(), last_activity: new Date() },
    { where: { id: body.conversation_id } }
  )

  const fullMsg = await Message.findByPk(msg.id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'photo_path'] },
      { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
      { model: MessageAttachment, as: 'attachments' },
    ],
  })

  const rawJson: any = fullMsg?.toJSON ? fullMsg.toJSON() : msg.toJSON()
  const payload = {
    chatMessage: {
      id: rawJson.id,
      conversation_id: rawJson.conversation_id,
      message: rawJson.message,
      contact_id: rawJson.contact_id,
      created_at: rawJson.created_at || rawJson.createdAt,
      user: null,
      contact: rawJson.contact || null,
      attachments: rawJson.attachments || [],
    },
    ...rawJson,
  }

  const pusher = getPusher()
  if (pusher) {
    try {
      await pusher.trigger(`chat.${body.conversation_id}`, 'NewChatMessage', payload)
      await pusher.trigger(`chat.${body.conversation_id}`, 'NewPublicChatMessage', payload)
    } catch (e) {
      /* silent */
    }
  }

  return { ...(fullMsg ? fullMsg.toJSON() : msg.toJSON()), message: 'Sent' }
})
