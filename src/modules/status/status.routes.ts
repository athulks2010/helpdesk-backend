import { StatusController } from './status.controller'
import { Router } from '../../core'

const controller = new StatusController()

export const statusWithMiddleware = new Router()
statusWithMiddleware.get('/all', async (req) => controller.all(req.query))
statusWithMiddleware.get('/single', async (req) => controller.single(req.query))
statusWithMiddleware.post('/create', async (req) => controller.create(req.body))
statusWithMiddleware.put('/update', async (req) => controller.update(req.body))
statusWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
statusWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
