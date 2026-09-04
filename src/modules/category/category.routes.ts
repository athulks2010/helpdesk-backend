import { CategoryController } from './category.controller'
import { Router } from '../../core'

const controller = new CategoryController()

export const categoryWithMiddleware = new Router()
categoryWithMiddleware.get('/all', async (req) => controller.all(req.query))
categoryWithMiddleware.get('/single', async (req) => controller.single(req.query))
categoryWithMiddleware.post('/create', async (req) => controller.create(req.body))
categoryWithMiddleware.put('/update', async (req) => controller.update(req.body))
categoryWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
categoryWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
