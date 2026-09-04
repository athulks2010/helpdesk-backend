import { FaqController } from './faq.controller'
import { Router } from '../../core'

const controller = new FaqController()

export const faqWithMiddleware = new Router()
faqWithMiddleware.get('/all', async (req) => controller.all(req.query))
faqWithMiddleware.get('/single', async (req) => controller.single(req.query))
faqWithMiddleware.post('/create', async (req) => controller.create(req.body))
faqWithMiddleware.put('/update', async (req) => controller.update(req.body))
faqWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
faqWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
