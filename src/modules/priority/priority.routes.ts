import { PriorityController } from './priority.controller'
import { Router } from '../../core'

const controller = new PriorityController()

export const priorityWithMiddleware = new Router()
priorityWithMiddleware.get('/all', async (req) => controller.all(req.query))
priorityWithMiddleware.get('/single', async (req) => controller.single(req.query))
priorityWithMiddleware.post('/create', async (req) => controller.create(req.body))
priorityWithMiddleware.put('/update', async (req) => controller.update(req.body))
priorityWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
priorityWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
