import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class User extends Model {
  declare id: number
  declare first_name: string
  declare last_name: string
  declare email: string
  declare password: string
  declare locale?: string
  declare role_id?: number
  declare phone?: string
  declare city?: string
  declare address?: string
  declare country_id?: number
  declare title?: string
  declare photo_path?: string
  declare remember_token?: string
  declare email_verified_at?: Date
  declare role?: any

  get full_name() {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim()
  }

  getAccess() {
    const items = [
      'faq', 'blog', 'chat', 'smtp', 'type', 'user', 'global', 'front_page', 'pusher',
      'status', 'ticket', 'contact', 'category', 'customer', 'language', 'priority',
      'department', 'organization', 'email_template', 'knowledge_base',
    ]
    const empty = { read: false, create: false, delete: false, update: false }
    if (this.role?.access) {
      try {
        return typeof this.role.access === 'string'
          ? JSON.parse(this.role.access)
          : this.role.access
      } catch {
        /* fallthrough */
      }
    }
    const access: any = {}
    items.forEach((i) => (access[i] = { ...empty }))
    return access
  }

  toSafeJSON() {
    const json: any = this.toJSON()
    delete json.password
    delete json.remember_token
    json.name = this.full_name
    json.access = this.getAccess()
    return json
  }
}

export const initUserModel = () => {
  User.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: { type: DataTypes.STRING, allowNull: false },
      password: DataTypes.STRING,
      locale: { type: DataTypes.STRING, defaultValue: 'en' },
      role_id: DataTypes.BIGINT.UNSIGNED,
      phone: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      country_id: DataTypes.INTEGER,
      title: { type: DataTypes.STRING, defaultValue: 'Engineer' },
      photo_path: DataTypes.STRING,
      remember_token: DataTypes.STRING,
      email_verified_at: DataTypes.DATE,
    },
    {
      sequelize: getSequelize(),
      tableName: 'users',
      defaultScope: { attributes: { exclude: [] } },
    }
  )
  return User
}
