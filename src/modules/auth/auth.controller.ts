import { AuthService } from './auth.service'
import { Validator } from '../../core'
import {
  LoginDto,
  RegisterDto,
  PasswordResetDto,
  PasswordResetWithTokenDto,
} from './auth.dto'
import { User } from '../user/user.model'

export class AuthController {
  private service = new AuthService()

  @Validator()
  login(body: LoginDto) {
    return this.service.login(body)
  }

  @Validator()
  register(body: RegisterDto) {
    return this.service.register(body)
  }

  me(user: User) {
    return this.service.me(user)
  }

  logout(authorization?: string) {
    return this.service.logout(authorization)
  }

  @Validator()
  passwordReset(body: PasswordResetDto) {
    return this.service.passwordReset(body)
  }

  @Validator()
  passwordResetWithToken(body: PasswordResetWithTokenDto) {
    return this.service.passwordResetWithToken(body)
  }
}
