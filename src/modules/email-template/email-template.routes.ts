import { EmailTemplateController } from './email-template.controller'
import { Router } from '../../core'

const controller = new EmailTemplateController()

export const emailTemplateWithMiddleware = new Router()
emailTemplateWithMiddleware.get('/all', async (req) => controller.all(req.query))
emailTemplateWithMiddleware.get('/single', async (req) => controller.single(req.query))
emailTemplateWithMiddleware.post('/create', async (req) => controller.create(req.body))
emailTemplateWithMiddleware.put('/update', async (req) => controller.update(req.body))
emailTemplateWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
emailTemplateWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
