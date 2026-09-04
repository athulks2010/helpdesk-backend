import { ConversationController } from './conversation.controller'
import { Router } from '../../core'

const conversationController = new ConversationController()

export const conversationWithMiddleware = new Router()
conversationWithMiddleware.get('/all', async (req) => conversationController.all(req.query))
conversationWithMiddleware.get('/single', async (req) => conversationController.single(req.query))
conversationWithMiddleware.post('/create', async (req) => conversationController.create(req.body))
conversationWithMiddleware.put('/update', async (req) => conversationController.update(req.body))
conversationWithMiddleware.delete('/delete', async (req) => conversationController.destroy(req.query))
conversationWithMiddleware.post('/messages', async (req) =>
  conversationController.sendMessage(req.body, (req as any).tokenHolder)
)
conversationWithMiddleware.get('/messages', async (req) => conversationController.getMessages(req.query))
conversationWithMiddleware.post('/mark-read', async (req) =>
  conversationController.markRead(req.body, (req as any).tokenHolder)
)
