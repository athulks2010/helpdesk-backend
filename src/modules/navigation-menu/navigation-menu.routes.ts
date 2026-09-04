import { NavigationMenuController } from './navigation-menu.controller'
import { Router } from '../../core'

const controller = new NavigationMenuController()

/** Public / unauthenticated navigation menu routes */
export const navigationMenu = new Router()
navigationMenu.get('/all', async (req) => controller.all(req.query))

/** Protected navigation menu routes (requires auth) */
export const navigationMenuWithMiddleware = new Router()
navigationMenuWithMiddleware.get('/all', async (req) => controller.all(req.query))
navigationMenuWithMiddleware.get('/single', async (req) => controller.single(req.query))
navigationMenuWithMiddleware.post('/create', async (req) => controller.create(req.body))
navigationMenuWithMiddleware.put('/update', async (req) => controller.update(req.body))
navigationMenuWithMiddleware.post('/reorder', async (req) => controller.reorder(req.body))
navigationMenuWithMiddleware.put('/reorder', async (req) => controller.reorder(req.body))
navigationMenuWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
navigationMenuWithMiddleware.post('/restore', async (req) => controller.restore(req.body))

