import { TypeController } from './type.controller'
import { Router } from '../../core'

const controller = new TypeController()

export const typeWithMiddleware = new Router()
typeWithMiddleware.get('/all', async (req) => controller.all(req.query))
typeWithMiddleware.get('/single', async (req) => controller.single(req.query))
typeWithMiddleware.post('/create', async (req) => controller.create(req.body))
typeWithMiddleware.put('/update', async (req) => controller.update(req.body))
typeWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
typeWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
