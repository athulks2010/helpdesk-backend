import { TicketFieldController } from './ticket-field.controller'
import { Router } from '../../core'

const controller = new TicketFieldController()

export const ticketFieldWithMiddleware = new Router()
ticketFieldWithMiddleware.get('/all', async (req) => controller.all(req.query))
ticketFieldWithMiddleware.get('/single', async (req) => controller.single(req.query))
ticketFieldWithMiddleware.post('/create', async (req) => controller.create(req.body))
ticketFieldWithMiddleware.put('/update', async (req) => controller.update(req.body))
ticketFieldWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
ticketFieldWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
