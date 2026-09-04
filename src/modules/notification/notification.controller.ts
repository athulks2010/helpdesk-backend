import { NotificationService } from './notification.service'

export class NotificationController {
  private service = new NotificationService()

  all(query: any, tokenHolder?: any) {
    const q = { ...query }
    if (!q.notifiable_id && tokenHolder?.id) {
      q.notifiable_id = tokenHolder.id
      q.notifiable_type = q.notifiable_type || 'App\\Models\\User'
    }
    return this.service.findAll(q)
  }

  markRead(body: any) {
    return this.service.markRead(body.id || body.ids)
  }
}
