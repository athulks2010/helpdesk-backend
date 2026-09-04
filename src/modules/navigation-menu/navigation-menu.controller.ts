import { NavigationMenuService } from './navigation-menu.service'

export class NavigationMenuController {
  private service = new NavigationMenuService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Navigation menu fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Navigation menu created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { ...(item?.toJSON?.() || item), message: 'Navigation menu updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Navigation menu deleted successfully' }
  }

  async restore(body: any) {
    const item: any = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item || {}), message: 'Navigation menu restored successfully' }
  }
}
