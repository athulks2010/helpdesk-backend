import { RoleController } from './role.controller'
import { Router } from '../../core'

const roleController = new RoleController()

export const roleWithMiddleware = new Router()
roleWithMiddleware.get('/all', async (req) => roleController.all(req.query))
roleWithMiddleware.get('/single', async (req) => roleController.single(req.query))
roleWithMiddleware.post('/create', async (req) => roleController.create(req.body))
roleWithMiddleware.put('/update', async (req) => roleController.update(req.body))
roleWithMiddleware.delete('/delete', async (req) => roleController.destroy(req.query))
roleWithMiddleware.post('/restore', async (req) => roleController.restore(req.body))
