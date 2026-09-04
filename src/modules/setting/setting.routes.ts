import { SettingController } from './setting.controller'
import { Router } from '../../core'

const controller = new SettingController()

/** Public / unauthenticated setting routes */
export const setting = new Router()
setting.get('/by-slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))
setting.get('/slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))
setting.get('/by-slug/:slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))
setting.get('/slug/:slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))

/** Protected setting routes (requires auth) */
export const settingWithMiddleware = new Router()
settingWithMiddleware.get('/all', async (req) => controller.all(req.query))
settingWithMiddleware.get('/single', async (req) => controller.single(req.query))
settingWithMiddleware.get('/by-slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))
settingWithMiddleware.get('/slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))
settingWithMiddleware.get('/by-slug/:slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))
settingWithMiddleware.get('/slug/:slug', async (req) => controller.findBySlug({ ...req.query, ...req.params }))
settingWithMiddleware.post('/create', async (req) => controller.create(req.body))
settingWithMiddleware.put('/update', async (req) => controller.update(req.body))
settingWithMiddleware.post('/update', async (req) => controller.update(req.body))

// SMTP
settingWithMiddleware.get('/smtp', async () => controller.getSmtp())
settingWithMiddleware.post('/smtp/update', async (req) => controller.updateSmtp(req.body))
settingWithMiddleware.put('/smtp/update', async (req) => controller.updateSmtp(req.body))

// Pusher
settingWithMiddleware.get('/pusher', async () => controller.getPusher())
settingWithMiddleware.post('/pusher/update', async (req) => controller.updatePusher(req.body))
settingWithMiddleware.put('/pusher/update', async (req) => controller.updatePusher(req.body))

// Email Piping (IMAP)
settingWithMiddleware.get('/email-piping', async () => controller.getPiping())
settingWithMiddleware.post('/email-piping/update', async (req) => controller.updatePiping(req.body))
settingWithMiddleware.put('/email-piping/update', async (req) => controller.updatePiping(req.body))
settingWithMiddleware.post('/piping/update', async (req) => controller.updatePiping(req.body))
settingWithMiddleware.put('/piping/update', async (req) => controller.updatePiping(req.body))

settingWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
settingWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
