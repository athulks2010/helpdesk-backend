import { Exception } from '../../core'
import { Notification } from './notification.model'

export class NotificationRepository {
  async findAll(query: any = {}) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 20
    const offset = (pageNumber - 1) * pageSize
    const where: any = {}

    if (query.notifiable_id) where.notifiable_id = query.notifiable_id
    if (query.notifiable_type) where.notifiable_type = query.notifiable_type
    if (query.unread === 'true' || query.unread === true) where.read_at = null

    const { rows, count } = await Notification.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    })

    return { items: rows, totalCount: count, message: 'Notifications fetched successfully' }
  }

  async markRead(ids: string | string[]) {
    const idList = Array.isArray(ids) ? ids : [ids]
    if (!idList.length) throw new Exception({ message: 'id is required', httpResponseCode: 422 })
    await Notification.update({ read_at: new Date() }, { where: { id: idList } })
    return { ids: idList, message: 'Notifications marked as read' }
  }
}
