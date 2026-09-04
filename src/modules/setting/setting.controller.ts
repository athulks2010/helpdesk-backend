import { SettingService } from './setting.service'

export class SettingController {
  private service = new SettingService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Setting fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Setting created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { ...(item?.toJSON?.() || item), message: 'Setting updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Setting deleted successfully' }
  }

  async restore(body: any) {
    const item: any = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item || {}), message: 'Setting restored successfully' }
  }
}
