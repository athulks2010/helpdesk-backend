import { Env } from './env.interface'

export const getEnvPath = () => {
  if (process.env.NODE_ENV === Env.LOCAL) return 'environments/local.env'
  if (process.env.NODE_ENV === Env.DEVELOPMENT) return 'environments/dev.env'
  if (process.env.NODE_ENV === Env.SANDBOX) return 'environments/sandbox.env'
  if (process.env.NODE_ENV === Env.TEST) return 'environments/test.env'
  if (process.env.NODE_ENV === Env.PRODUCTION) return 'environments/prod.env'
  return 'environments/local.env'
}
