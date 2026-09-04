import crypto from 'crypto'
import { Exception, Validator } from '../../core'
import { SanctumTokenService } from '../../utils/sanctum'
import { User } from '../user/user.model'
import { Role } from '../role/role.model'
import { PasswordReset } from './password-reset.model'
import { EmailTemplate } from '../email-template/email-template.model'
import { mailService } from '../../utils/mail'
import {
  LoginDto,
  RegisterDto,
  PasswordResetDto,
  PasswordResetWithTokenDto,
} from './auth.dto'

const sanctum = new SanctumTokenService()

export class AuthService {
  @Validator()
  async login(body: LoginDto) {
    const user = await User.findOne({
      where: { email: body.email },
      include: [{ model: Role, as: 'role' }],
    })
    if (!user || !(await sanctum.checkPassword(body.password, user.password))) {
      throw new Exception({ message: 'Invalid credentials', httpResponseCode: 401 })
    }
    const token = await sanctum.createToken(user.id, 'api-token')
    return {
      user: user.toSafeJSON(),
      token,
      token_type: 'Bearer',
      message: 'Login successful',
    }
  }

  @Validator()
  async register(body: RegisterDto) {
    if (body.password_confirmation && body.password !== body.password_confirmation) {
      throw new Exception({ message: 'Password confirmation mismatch', httpResponseCode: 422 })
    }
    const exists = await User.findOne({ where: { email: body.email } })
    if (exists) {
      throw new Exception({ message: 'Email already registered', httpResponseCode: 422 })
    }
    let roleId = body.role_id
    if (!roleId) {
      const customer = await Role.findOne({ where: { slug: 'customer' } })
      roleId = customer?.id
    }
    const user = await User.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: await sanctum.hashPassword(body.password),
      role_id: roleId,
    })
    await user.reload({ include: [{ model: Role, as: 'role' }] })



    const token = await sanctum.createToken(user.id, 'api-token')
    return {
      user: user.toSafeJSON(),
      token,
      token_type: 'Bearer',
      message: 'Registration successful',
    }
  }

  async me(user: User) {
    await user.reload({ include: [{ model: Role, as: 'role' }] })
    return { user: user.toSafeJSON(), message: 'OK' }
  }

  async logout(authorization?: string) {
    await sanctum.revokeBearer(authorization)
    return { message: 'Logged out' }
  }

  @Validator()
  async passwordReset(body: PasswordResetDto) {
    const user = await User.findOne({ where: { email: body.email } })
    if (!user) {
      return { message: 'If the email exists, a reset link was sent' }
    }
    const token = crypto.randomBytes(32).toString('hex')
    const hashed = crypto.createHash('sha256').update(token).digest('hex')
    await PasswordReset.destroy({ where: { email: body.email } })
    await PasswordReset.create({
      email: body.email,
      token: hashed,
      created_at: new Date(),
    })
    const url = `${process.env.APP_URL || ''}/password-reset/${token}?email=${encodeURIComponent(
      body.email
    )}`
    await mailService.send(
      body.email,
      'Password Reset',
      `<p>Reset your password: <a href="${url}">${url}</a></p>`
    )
    return { message: 'If the email exists, a reset link was sent' }
  }

  @Validator()
  async passwordResetWithToken(body: PasswordResetWithTokenDto) {
    if (body.password_confirmation && body.password !== body.password_confirmation) {
      throw new Exception({ message: 'Password confirmation mismatch', httpResponseCode: 422 })
    }
    const hashed = crypto.createHash('sha256').update(body.token).digest('hex')
    const row = await PasswordReset.findOne({ where: { email: body.email, token: hashed } })
    if (!row) {
      throw new Exception({ message: 'Invalid or expired reset token', httpResponseCode: 422 })
    }
    const user = await User.findOne({ where: { email: body.email } })
    if (!user) {
      throw new Exception({ message: 'User not found', httpResponseCode: 404 })
    }
    await user.update({ password: await sanctum.hashPassword(body.password) })
    await PasswordReset.destroy({ where: { email: body.email } })
    return { message: 'Password updated' }
  }
}
