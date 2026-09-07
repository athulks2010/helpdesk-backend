import { PublicService } from './public.service'

const service = new PublicService()

export class PublicController {
  async getFaqs(req: any) {
    return service.getFaqs()
  }

  async getPosts(req: any) {
    const pageSize = Number(req.query.pageSize || 15)
    return service.getPosts(pageSize)
  }

  async getSinglePost(req: any) {
    return service.getSinglePost(req.query)
  }

  async getKnowledgeBase(req: any) {
    return service.getKnowledgeBase()
  }

  async getServices(req: any) {
    return service.getServices()
  }

  async getFrontPage(req: any) {
    const slug = String(req.query.slug || 'home')
    return service.getFrontPage(slug)
  }

  async openTicket(req: any) {
    const body = req.body || {}
    if (req.tokenHolder?.id) {
      body.user_id = req.tokenHolder.id
    }
    return service.openTicket(body)
  }

  async subscribeNews(req: any) {
    return service.subscribeNews(req.body?.email)
  }

  async initChat(req: any) {
    const body = req.body || {}
    return service.initChat(body)
  }

  async getConversation(req: any) {
    const id = Number(req.query.id)
    return service.getConversation(id)
  }

  async sendChatMessage(req: any) {
    const body = req.body || {}
    return service.sendChatMessage(body)
  }
}
