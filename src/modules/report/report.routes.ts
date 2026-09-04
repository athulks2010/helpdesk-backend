import { ReportController } from './report.controller'
import { Router } from '../../core'

const reportController = new ReportController()

export const reportWithMiddleware = new Router()
reportWithMiddleware.post('/generate', async (req) => reportController.generate(req.body))
reportWithMiddleware.get('/show', async (req) => reportController.show(req.query))
