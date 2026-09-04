import { ServiceService } from './service.service'

export class ServiceController {
  private service = new ServiceService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Service fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Service created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { ...(item?.toJSON?.() || item), message: 'Service updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Service deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item), message: 'Service restored successfully' }
  }
}
