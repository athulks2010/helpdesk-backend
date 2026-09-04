import { AiController } from './ai.controller'
import { Router } from '../../core'

const aiController = new AiController()

export const aiWithMiddleware = new Router()
aiWithMiddleware.post('/classify', async (req) => aiController.classify(req.body))
aiWithMiddleware.post('/suggestions', async (req) => aiController.suggestions(req.body))
aiWithMiddleware.post('/sentiment', async (req) => aiController.sentiment(req.body))
aiWithMiddleware.get('/status', async () => aiController.status())
aiWithMiddleware.get('/analytics', async () => aiController.analytics())
aiWithMiddleware.put('/settings', async (req) => aiController.settings(req.body))
