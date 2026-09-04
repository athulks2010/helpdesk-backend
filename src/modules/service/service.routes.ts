import { ServiceController } from './service.controller'
import { Router } from '../../core'

const controller = new ServiceController()

export const serviceWithMiddleware = new Router()
serviceWithMiddleware.get('/all', async (req) => controller.all(req.query))
serviceWithMiddleware.get('/single', async (req) => controller.single(req.query))
serviceWithMiddleware.post('/create', async (req) => controller.create(req.body))
serviceWithMiddleware.put('/update', async (req) => controller.update(req.body))
serviceWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
serviceWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
