import { UserRepository } from './user.repository'

const repo = new UserRepository()

export class UserService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  create(body: any) {
    return repo.create(body)
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
