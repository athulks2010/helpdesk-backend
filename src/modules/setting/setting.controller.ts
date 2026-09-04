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

  async findBySlug(query: any) {
    const slug = query?.slug || query?.key
    const item: any = await this.service.findBySlug(slug)
    return { ...(item?.toJSON?.() || item), message: 'Setting fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Setting created successfully' }
  }

  async update(body: any) {
    const item: any = await this.service.update(body)
    if (item && item.message) {
      return item
    }
    return { ...(item?.toJSON?.() || item), message: 'Setting updated successfully' }
  }

  async getSmtp() {
    const item = await this.service.getSmtpSettings()
    return { item, message: 'SMTP settings fetched successfully' }
  }

  async updateSmtp(body: any) {
    return this.service.updateSmtpSettings(body)
  }

  async getPusher() {
    const item = await this.service.getPusherSettings()
    return { item, message: 'Pusher settings fetched successfully' }
  }

  async updatePusher(body: any) {
    return this.service.updatePusherSettings(body)
  }

  async getPiping() {
    const item = await this.service.getPipingSettings()
    return { item, message: 'Email piping settings fetched successfully' }
  }

  async updatePiping(body: any) {
    return this.service.updatePipingSettings(body)
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
