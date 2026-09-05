import { FrontPageController } from './front-page.controller'
import { Router } from '../../core'

const controller = new FrontPageController()

export const frontPageWithMiddleware = new Router()
frontPageWithMiddleware.get('/all', async (req) => controller.all(req.query))
frontPageWithMiddleware.get('/single', async (req) => controller.single(req.query))
frontPageWithMiddleware.get('/single-by-slug', async (req) => controller.singleBySlug(req.query))
frontPageWithMiddleware.post('/create', async (req) => controller.create(req.body))
frontPageWithMiddleware.put('/update', async (req) => controller.update(req.body))
frontPageWithMiddleware.put('/update-by-slug', async (req) => controller.updateBySlug(req.body))
frontPageWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
frontPageWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
