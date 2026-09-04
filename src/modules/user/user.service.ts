import { UserRepository } from './user.repository'
import { EmailTemplate } from '../email-template/email-template.model'
import { mailService } from '../../utils/mail'
const repo = new UserRepository()

export class UserService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  async create(body: any) {
    var item = await repo.create(body)
    await mailService.sendTemplate('user_created', item.email, {
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
    })
    return item
  }

  update(body: any) {
    return repo.update(body)
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }

  findPending(query: any) {
    return repo.findPending(query)
  }

  approvePending(id: number | string) {
    return repo.approvePending(id)
  }

  declinePending(id: number | string) {
    return repo.declinePending(id)
  }
}
