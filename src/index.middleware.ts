import { Request, Response, NextFunction } from 'express'
import { SanctumTokenService } from './utils/sanctum'
import { Exception } from './core'

const sanctum = new SanctumTokenService()

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await sanctum.findUserByBearer(req.headers.authorization)
    if (!user) {
      throw new Exception({ message: 'Unauthenticated', httpResponseCode: 401 })
    }
    ;(req as any).tokenHolder = user
    next()
  } catch (e) {
    next(e)
  }
}

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await sanctum.findUserByBearer(req.headers.authorization)
    if (user) (req as any).tokenHolder = user
    next()
  } catch {
    next()
  }
}
