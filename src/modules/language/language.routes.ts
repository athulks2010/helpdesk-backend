import { LanguageController } from './language.controller'
import { Router } from '../../core'

const controller = new LanguageController()

export const languageWithMiddleware = new Router()
languageWithMiddleware.get('/all', async (req) => controller.all(req.query))
languageWithMiddleware.get('/single', async (req) => controller.single(req.query))
languageWithMiddleware.post('/create', async (req) => controller.create(req.body))
languageWithMiddleware.put('/update', async (req) => controller.update(req.body))
languageWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
languageWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
