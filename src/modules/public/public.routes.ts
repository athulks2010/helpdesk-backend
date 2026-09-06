import { Router } from '../../core'
import { Faq } from '../faq/faq.model'
import { Post } from '../post/post.model'
import { KnowledgeBase } from '../knowledge-base/knowledge-base.model'
import { Service } from '../service/service.model'
import { FrontPage } from '../front-page/front-page.model'
import { TicketService } from '../ticket/ticket.service'
import { Conversation } from '../conversation/conversation.model'
import { Message } from '../conversation/message.model'
import { Contact } from '../contact/contact.model'
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
  const items = await KnowledgeBase.findAll({ order: [['id', 'DESC']] })
  return { items, totalCount: items.length, message: 'OK' }
})

publicRouter.get('/services', async () => {
  const items = await Service.findAll({ order: [['id', 'DESC']] })
  return { items, totalCount: items.length, message: 'OK' }
})

publicRouter.get('/front-page', async (req) => {
  const slug = String(req.query.slug || 'home')
  const row = await FrontPage.findOne({ where: { slug } })
  return { ...(row?.toJSON() || {}), message: 'OK' }
})

publicRouter.post('/ticket/open', async (req) => {
  const body = req.body || {}
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
  const conversation = await Conversation.create({
    contact_id: contact?.id,
    subject: body.subject || 'Public chat',
  } as any)
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
  const pusher = getPusher()
  if (pusher) {
    await pusher.trigger(`chat.${body.conversation_id}`, 'NewPublicChatMessage', msg.toJSON())
  }
  return { ...msg.toJSON(), message: 'Sent' }
})
