import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { PersonalAccessToken } from '../modules/auth/personal-access-token.model'
import { User } from '../modules/user/user.model'
import { Role } from '../modules/role/role.model'

const USER_MORPH = 'App\\Models\\User'

export class SanctumTokenService {
  /** Create Sanctum-compatible token: plainText = `{id}|{random40}`, DB stores sha256(random) */
  async createToken(userId: number, name = 'api-token', abilities: string[] = ['*']) {
    const plain = crypto.randomBytes(20).toString('hex')
    const hashed = crypto.createHash('sha256').update(plain).digest('hex')
    const row = await PersonalAccessToken.create({
      tokenable_type: USER_MORPH,
      tokenable_id: userId,
      name,
      token: hashed,
      abilities: JSON.stringify(abilities),
    })
    return `${row.id}|${plain}`
  }

  async findUserByBearer(authorization?: string): Promise<User | null> {
    if (!authorization?.startsWith('Bearer ')) return null
    const raw = authorization.slice(7).trim()
    const [idPart, plain] = raw.split('|')
    if (!idPart || !plain) return null
    const id = Number(idPart)
    if (!id) return null
    const hashed = crypto.createHash('sha256').update(plain).digest('hex')
    const tokenRow = await PersonalAccessToken.findOne({
      where: { id, token: hashed, tokenable_type: USER_MORPH },
    })
    if (!tokenRow) return null
    if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) return null
    await tokenRow.update({ last_used_at: new Date() })
    const user = await User.findByPk(tokenRow.tokenable_id, {
      include: [{ model: Role, as: 'role' }],
    })
    return user
  }

  async revokeBearer(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) return
    const raw = authorization.slice(7).trim()
    const [idPart, plain] = raw.split('|')
    if (!idPart || !plain) return
    const hashed = crypto.createHash('sha256').update(plain).digest('hex')
    await PersonalAccessToken.destroy({
      where: { id: Number(idPart), token: hashed },
    })
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }

  async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  }
}
