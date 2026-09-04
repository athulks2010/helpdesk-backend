import { NotificationController } from './notification.controller'
import { Router } from '../../core'

const notificationController = new NotificationController()

export const notificationWithMiddleware = new Router()
notificationWithMiddleware.get('/all', async (req) =>
  notificationController.all(req.query, (req as any).tokenHolder)
)
notificationWithMiddleware.post('/mark-read', async (req) => notificationController.markRead(req.body))
