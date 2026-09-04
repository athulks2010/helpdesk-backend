import { KnowledgeBaseService } from './knowledge-base.service'

export class KnowledgeBaseController {
  private service = new KnowledgeBaseService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Knowledge base fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Knowledge base created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { ...(item?.toJSON?.() || item), message: 'Knowledge base updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Knowledge base deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item), message: 'Knowledge base restored successfully' }
  }
}
