import { KnowledgeBaseController } from './knowledge-base.controller'
import { Router } from '../../core'

const controller = new KnowledgeBaseController()

export const knowledgeBaseWithMiddleware = new Router()
knowledgeBaseWithMiddleware.get('/all', async (req) => controller.all(req.query))
knowledgeBaseWithMiddleware.get('/single', async (req) => controller.single(req.query))
knowledgeBaseWithMiddleware.post('/create', async (req) => controller.create(req.body))
knowledgeBaseWithMiddleware.put('/update', async (req) => controller.update(req.body))
knowledgeBaseWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
knowledgeBaseWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
