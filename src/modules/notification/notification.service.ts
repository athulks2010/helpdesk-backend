import { NotificationRepository } from './notification.repository'

const repo = new NotificationRepository()

export class NotificationService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  markRead(ids: string | string[]) {
    return repo.markRead(ids)
  }
}
