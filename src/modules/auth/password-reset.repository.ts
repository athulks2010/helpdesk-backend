import { PasswordReset } from './password-reset.model'

export class PasswordResetRepository {
  async create(body: any) {
    return PasswordReset.create(body)
  }

  async findOne(email: string, token: string) {
    return PasswordReset.findOne({ where: { email, token } })
  }

  async destroyByEmail(email: string) {
    return PasswordReset.destroy({ where: { email } })
  }
}
