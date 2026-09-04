import { RoleService } from './role.service'

export class RoleController {
  private service = new RoleService()

  async all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { item, message: 'Role fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { item, message: 'Role created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { item, message: 'Role updated successfully' }
  }

  async destroy(query: any) {
    const item = await this.service.destroy(query.id)
    return { item, message: 'Role deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { item, message: 'Role restored successfully' }
  }
}
