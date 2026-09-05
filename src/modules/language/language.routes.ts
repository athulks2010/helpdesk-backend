import { LanguageController } from './language.controller'
import { Router } from '../../core'

const controller = new LanguageController()

/** Public routes (for UI translation lookup) */
export const language = new Router()
language.get('/translations', async (req) => controller.getTranslations(req.query))

/** Protected routes */
export const languageWithMiddleware = new Router()
languageWithMiddleware.get('/all', async (req) => controller.all(req.query))
languageWithMiddleware.get('/single', async (req) => controller.single(req.query))
languageWithMiddleware.post('/create', async (req) => controller.create(req.body))
languageWithMiddleware.put('/update', async (req) => controller.update(req.body))
languageWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
languageWithMiddleware.post('/restore', async (req) => controller.restore(req.body))

// Translation phrase management
languageWithMiddleware.get('/translations', async (req) => controller.getTranslations(req.query))
languageWithMiddleware.post('/phrase', async (req) => controller.addPhrase(req.body))
languageWithMiddleware.put('/phrase', async (req) => controller.updatePhrase(req.body))
languageWithMiddleware.delete('/phrase', async (req) => controller.deletePhrase({ ...req.query, ...req.body }))
