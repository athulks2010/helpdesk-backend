import { FrontPageService } from './front-page.service'

export class FrontPageController {
  private service = new FrontPageService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Front page fetched successfully' }
  }

  async singleBySlug(query: any) {
    const item = await this.service.findBySlug(query.slug)
    return { ...(item?.toJSON?.() || item), message: 'Front page fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Front page created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { ...(item?.toJSON?.() || item), message: 'Front page updated successfully' }
  }

  async updateBySlug(body: any) {
    const item = await this.service.updateBySlug(body)
    return { ...(item?.toJSON?.() || item), message: 'Front page updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Front page deleted successfully' }
  }

  async restore(body: any) {
    const item: any = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item || {}), message: 'Front page restored successfully' }
  }
}
