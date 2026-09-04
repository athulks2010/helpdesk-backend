import { SettingController } from './setting.controller'
import { Router } from '../../core'

const controller = new SettingController()

export const settingWithMiddleware = new Router()
settingWithMiddleware.get('/all', async (req) => controller.all(req.query))
settingWithMiddleware.get('/single', async (req) => controller.single(req.query))
settingWithMiddleware.post('/create', async (req) => controller.create(req.body))
settingWithMiddleware.put('/update', async (req) => controller.update(req.body))
settingWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
settingWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
