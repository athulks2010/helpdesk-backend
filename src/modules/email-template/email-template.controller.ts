import { EmailTemplateService } from './email-template.service'

export class EmailTemplateController {
  private service = new EmailTemplateService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Email template fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Email template created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { ...(item?.toJSON?.() || item), message: 'Email template updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Email template deleted successfully' }
  }

  async restore(body: any) {
    const item: any = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item || {}), message: 'Email template restored successfully' }
  }
}
