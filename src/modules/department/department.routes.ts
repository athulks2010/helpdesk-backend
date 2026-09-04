import { DepartmentController } from './department.controller'
import { Router } from '../../core'

const controller = new DepartmentController()

export const departmentWithMiddleware = new Router()
departmentWithMiddleware.get('/all', async (req) => controller.all(req.query))
departmentWithMiddleware.get('/single', async (req) => controller.single(req.query))
departmentWithMiddleware.post('/create', async (req) => controller.create(req.body))
departmentWithMiddleware.put('/update', async (req) => controller.update(req.body))
departmentWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
departmentWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
