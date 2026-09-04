import { UserController } from './user.controller'
import { Router } from '../../core'

const userController = new UserController()

export const userWithMiddleware = new Router()
userWithMiddleware.get('/all', async (req) => userController.all(req.query))
userWithMiddleware.get('/single', async (req) => userController.single(req.query))
userWithMiddleware.post('/create', async (req) => userController.create(req.body))
userWithMiddleware.put('/update', async (req) => userController.update(req.body))
userWithMiddleware.delete('/delete', async (req) => userController.destroy(req.query))
userWithMiddleware.post('/restore', async (req) => userController.restore(req.body))
userWithMiddleware.get('/pending', async (req) => userController.pending(req.query))
userWithMiddleware.post('/pending/approve', async (req) => userController.approvePending(req.body))
userWithMiddleware.post('/pending/decline', async (req) => userController.declinePending(req.body))
