import { DashboardController } from './dashboard.controller'
import { Router } from '../../core'

const dashboardController = new DashboardController()

export const dashboardWithMiddleware = new Router()
dashboardWithMiddleware.get('/metrics', async () => dashboardController.metrics())
dashboardWithMiddleware.get('/analytics', async () => dashboardController.analytics())
dashboardWithMiddleware.get('/performance', async () => dashboardController.performance())
dashboardWithMiddleware.get('/charts', async () => dashboardController.charts())
