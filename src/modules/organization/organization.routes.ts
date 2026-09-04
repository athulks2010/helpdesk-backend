import { OrganizationController } from './organization.controller'
import { Router } from '../../core'

const controller = new OrganizationController()

export const organizationWithMiddleware = new Router()
organizationWithMiddleware.get('/all', async (req) => controller.all(req.query))
organizationWithMiddleware.get('/single', async (req) => controller.single(req.query))
organizationWithMiddleware.post('/create', async (req) => controller.create(req.body))
organizationWithMiddleware.put('/update', async (req) => controller.update(req.body))
organizationWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
organizationWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
