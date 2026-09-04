import { PostController } from './post.controller'
import { Router } from '../../core'

const controller = new PostController()

export const postWithMiddleware = new Router()
postWithMiddleware.get('/all', async (req) => controller.all(req.query))
postWithMiddleware.get('/single', async (req) => controller.single(req.query))
postWithMiddleware.post('/create', async (req) => controller.create(req.body))
postWithMiddleware.put('/update', async (req) => controller.update(req.body))
postWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
postWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
