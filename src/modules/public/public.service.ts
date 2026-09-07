import { FaqRepository } from '../faq/faq.repository'
import { PostRepository } from '../post/post.repository'
import { KnowledgeBaseRepository } from '../knowledge-base/knowledge-base.repository'
import { ServiceRepository } from '../service/service.repository'
import { FrontPageRepository } from '../front-page/front-page.repository'
import { TicketService } from '../ticket/ticket.service'
import { ConversationRepository } from '../conversation/conversation.repository'
import { ContactRepository } from '../contact/contact.repository'
import { ContactService } from '../contact/contact.service'
import { UserRepository } from '../user/user.repository'
import { SettingRepository } from '../setting/setting.repository'
import { DepartmentRepository } from '../department/department.repository'
import { CategoryRepository } from '../category/category.repository'
import { PriorityRepository } from '../priority/priority.repository'
import { TypeRepository } from '../type/type.repository'
import { Contact } from '../contact/contact.model'
import { Exception } from '../../core'
import { getPusher } from '../../utils/pusher'

export class PublicService {
  async getDepartments(query: any = {}) {
    const pageSize = Number(query?.pageSize) || 100
    return new DepartmentRepository().findAll({ ...query, pageSize })
  }

  async getCategories(query: any = {}) {
    const pageSize = Number(query?.pageSize) || 100
    return new CategoryRepository().findAll({ ...query, pageSize })
  }

  async getPriorities(query: any = {}) {
    const pageSize = Number(query?.pageSize) || 100
    return new PriorityRepository().findAll({ ...query, pageSize })
  }

  async getTypes(query: any = {}) {
    const pageSize = Number(query?.pageSize) || 100
    return new TypeRepository().findAll({ ...query, pageSize })
  }


  async getFaqs() {
    const res = await new FaqRepository().findAll({ sortOrder: 'ASC' })
    return res
  }

  async getPosts(pageSize: number) {
    const res = await new PostRepository().findAll({ pageSize, sortOrder: 'DESC' })
    return res
  }

  async getSinglePost(query: any) {
    const postRepo = new PostRepository()
    if (query.slug) {
      const res = await postRepo.findAll({ slug: query.slug })
      return { ...(res.items[0]?.toJSON ? res.items[0].toJSON() : res.items[0] || {}), message: 'OK' }
    } else {
      try {
        const item = await postRepo.findById(query.id)
        return { ...(item?.toJSON ? item.toJSON() : item || {}), message: 'OK' }
      } catch {
        return { message: 'Not found' }
      }
    }
  }

  async getKnowledgeBase() {
    const res = await new KnowledgeBaseRepository().findAll({ sortOrder: 'ASC' })
    return res
  }

  async getServices() {
    const res = await new ServiceRepository().findAll({ sortOrder: 'ASC' })
    return res
  }

  async getFrontPage(slug: string) {
    const res = await new FrontPageRepository().findAll({ slug })
    return { ...(res.items[0]?.toJSON ? res.items[0].toJSON() : res.items[0] || {}), message: 'OK' }
  }

  async openTicket(body: any) {
    const password = Math.random().toString(36).slice(-8)
    let user_id = body.user_id
    if (!user_id && body.email) {
      let user = await new UserRepository().findByEmail(body.email)
      if (!user) {
        user = await new UserRepository().create({
          email: body.email,
          first_name: body.first_name || body.name || 'Guest',
          last_name: body.last_name || '',
          password,
        })
      }
      user_id = user.id
    }

    const ticket = await new TicketService().create({
      subject: body.subject,
      details: body.details || body.body || body.message,
      user_id: user_id,
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
  }

  async subscribeNews(email: string) {
    const value = String(email || '').trim()
    if (!value) {
      throw new Exception({ message: 'Email is required', httpResponseCode: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Exception({ message: 'A valid email is required', httpResponseCode: 400 })
    }
    if (value.length > 50) {
      throw new Exception({ message: 'Email must be 50 characters or fewer', httpResponseCode: 400 })
    }

    const newsletterEnabled = await this.isNewsletterEnabled()
    if (!newsletterEnabled) {
      throw new Exception({ message: 'Newsletter is disabled', httpResponseCode: 400 })
    }

    const contact = await Contact.create({
      email: value,
      first_name: null,
      last_name: null,
    } as any)

    return {
      id: contact.id,
      email: contact.email,
      first_name: contact.first_name ?? null,
      last_name: contact.last_name ?? null,
      message: 'You just subscribed for the latest news. Thank You!',
    }
  }

  async addContact(body: any) {
    return new ContactService().create(body)
  }

  private async isNewsletterEnabled() {
    try {
      const setting = await new SettingRepository().findBySlug('enable_options')
      let options: any = setting?.value
      if (typeof options === 'string') {
        options = JSON.parse(options)
      }
      if (!Array.isArray(options)) return false
      const item = options.find((option: any) => option?.slug === 'newsletter')
      if (!item) return false
      return item.value === true || item.value === 1 || item.value === '1' || item.value === 'true'
    } catch {
      return false
    }
  }

  async initChat(body: any) {
    let contact: any = null
    const contactRepo = new ContactRepository()
    if (body.email) {
      const res = await contactRepo.findAll({ email: body.email })
      contact = res.items.find((c: any) => c.email === body.email) || null
      if (!contact) {
        contact = await contactRepo.create({
          first_name: body.first_name || 'Guest',
          last_name: body.last_name || '',
          email: body.email,
          phone: body.phone,
        })
      }
    }

    let conversation: any = null
    const convRepo = new ConversationRepository()
    if (contact) {
      const res = await convRepo.findAll({ contact_id: contact.id })
      conversation = res.items.find((c: any) => c.status === 'active' && c.contact_id === contact.id) || null
    }

    if (!conversation) {
      conversation = await convRepo.create({
        contact_id: contact?.id,
        title: body.subject || body.title || 'Live Support Chat',
        type: 'customer',
        source: 'website',
        status: 'active',
        priority: body.priority || 'medium',
        department: body.department || 'general',
        initial_message: 'Hello! Welcome to our support chat. An agent will be with you shortly.'
      })

      const welcomeMsgRes = await convRepo.getMessages(conversation.id, { pageSize: 1 })
      const welcomeMsg: any = welcomeMsgRes.items[0]
      if (welcomeMsg) {
        const pusher = getPusher()
        if (pusher) {
          const payload = {
            chatMessage: {
              id: welcomeMsg.id,
              conversation_id: conversation.id,
              message: welcomeMsg.message,
              created_at: welcomeMsg.created_at || welcomeMsg.createdAt || new Date().toISOString(),
              user: welcomeMsg.user || null,
              contact: null,
              attachments: [],
            },
            ...(welcomeMsg.toJSON ? welcomeMsg.toJSON() : welcomeMsg),
          }
          try {
            await pusher.trigger(`chat.${conversation.id}`, 'NewChatMessage', payload)
          } catch (e) { }
        }
      }
    }

    return {
      conversation: conversation?.toJSON ? conversation.toJSON() : conversation,
      contact: contact?.toJSON ? contact.toJSON() : contact,
      message: 'Chat initialized',
    }
  }

  async getConversation(id: number) {
    const convRepo = new ConversationRepository()
    const conversation = await convRepo.findById(id)
    const messagesRes = await convRepo.getMessages(id, { pageSize: 1000 })
    return {
      conversation: conversation?.toJSON ? conversation.toJSON() : conversation,
      messages: messagesRes.items,
      message: 'OK'
    }
  }

  async sendChatMessage(body: any) {
    const convRepo = new ConversationRepository()
    const fullMsg = await convRepo.sendMessage({
      conversation_id: body.conversation_id,
      message: body.message,
      contact_id: body.contact_id,
    })

    const rawJson: any = fullMsg?.toJSON ? fullMsg.toJSON() : fullMsg
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
      } catch (e) { }
    }

    return { ...rawJson, message: 'Sent' }
  }
}
