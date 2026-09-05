import crypto from 'crypto'
import { Exception, Validator } from '../../core'
import { SanctumTokenService } from '../../utils/sanctum'
import { User } from '../user/user.model'
import { UserRepository } from '../user/user.repository'
import { RoleRepository } from '../role/role.repository'
import { PasswordResetRepository } from './password-reset.repository'
import { mailService } from '../../utils/mail'
import {
  LoginDto,
  RegisterDto,
  PasswordResetDto,
  PasswordResetWithTokenDto,
} from './auth.dto'

const sanctum = new SanctumTokenService()
const userRepo = new UserRepository()
const roleRepo = new RoleRepository()
const passwordResetRepo = new PasswordResetRepository()

export class AuthService {
  @Validator()
  async login(body: LoginDto) {
    const user = await userRepo.findByEmail(body.email, true)
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
    const exists = await userRepo.findByEmail(body.email)
    if (exists) {
      throw new Exception({ message: 'Email already registered', httpResponseCode: 422 })
    }
    const customer = await roleRepo.findBySlug('customer')
    const roleId = customer?.id || 2

    const createdUserJson = await userRepo.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      country_id: body.country_id,
      city: body.city,
      address: body.address,
      password: body.password,
      role_id: roleId,
    })

    const user = await userRepo.findById(createdUserJson.id)
    await user.reload({ include: [{ association: 'role' }] })

    const token = await sanctum.createToken(user.id, 'api-token')
    return {
      user: user.toSafeJSON(),
      token,
      token_type: 'Bearer',
      message: 'Registration successful',
    }
  }

  async me(user: User) {
    await user.reload({ include: [{ association: 'role' }] })
    return { user: user.toSafeJSON(), message: 'OK' }
  }

  async logout(authorization?: string) {
    await sanctum.revokeBearer(authorization)
    return { message: 'Logged out' }
  }

  @Validator()
  async passwordReset(body: PasswordResetDto) {
    const user = await userRepo.findByEmail(body.email)
    if (!user) {
      return { message: 'If the email exists, a reset link was sent' }
    }
    const token = crypto.randomBytes(32).toString('hex')
    const hashed = crypto.createHash('sha256').update(token).digest('hex')
    await passwordResetRepo.destroyByEmail(body.email)
    await passwordResetRepo.create({
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
    const row = await passwordResetRepo.findOne(body.email, hashed)
    if (!row) {
      throw new Exception({ message: 'Invalid or expired reset token', httpResponseCode: 422 })
    }
    const user = await userRepo.findByEmail(body.email)
    if (!user) {
      throw new Exception({ message: 'User not found', httpResponseCode: 404 })
    }
    await userRepo.update({ id: user.id, password: body.password })
    await passwordResetRepo.destroyByEmail(body.email)
    return { message: 'Password updated' }
  }
}
