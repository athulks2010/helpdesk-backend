import { DashboardController } from './dashboard.controller'
import { Router } from '../../core'

const dashboardController = new DashboardController()

export const dashboardWithMiddleware = new Router()
dashboardWithMiddleware.get('/metrics', async (req) => dashboardController.metrics((req as any).tokenHolder))
dashboardWithMiddleware.get('/analytics', async (req) => dashboardController.analytics((req as any).tokenHolder))
dashboardWithMiddleware.get('/performance', async (req) => dashboardController.performance((req as any).tokenHolder))
dashboardWithMiddleware.get('/charts', async (req) => dashboardController.charts((req as any).tokenHolder))
