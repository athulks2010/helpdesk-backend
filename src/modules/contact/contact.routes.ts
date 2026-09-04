import { ContactController } from './contact.controller'
import { Router } from '../../core'

const controller = new ContactController()

export const contactWithMiddleware = new Router()
contactWithMiddleware.get('/all', async (req) => controller.all(req.query))
contactWithMiddleware.get('/single', async (req) => controller.single(req.query))
contactWithMiddleware.post('/create', async (req) => controller.create(req.body))
contactWithMiddleware.put('/update', async (req) => controller.update(req.body))
contactWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
contactWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
