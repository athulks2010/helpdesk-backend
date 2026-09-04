import { UserService } from './user.service'

export class UserController {
  private service = new UserService()

  async all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { item, message: 'User fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { item, message: 'User created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { item, message: 'User updated successfully' }
  }

  async destroy(query: any) {
    const item = await this.service.destroy(query.id)
    return { item, message: 'User deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { item, message: 'User restored successfully' }
  }

  async pending(query: any) {
    return this.service.findPending(query)
  }

  async approvePending(body: any) {
    const item = await this.service.approvePending(body.id)
    return { item, message: 'Pending user approved' }
  }

  async declinePending(body: any) {
    return this.service.declinePending(body.id)
  }
}
