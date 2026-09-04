import { AuthController } from './auth.controller'
import { Router } from '../../core'

const authController = new AuthController()

export const auth = new Router()
auth.post('/login', async (req) => authController.login(req.body))
auth.post('/register', async (req) => authController.register(req.body))
auth.post('/password/reset', async (req) => authController.passwordReset(req.body))
auth.post('/password/reset/:token', async (req) =>
  authController.passwordResetWithToken({ ...req.body, token: req.params.token })
)

export const authWithMiddleware = new Router()
authWithMiddleware.get('/me', async (req) => authController.me((req as any).tokenHolder))
authWithMiddleware.post('/logout', async (req) =>
  authController.logout(req.headers.authorization)
)
