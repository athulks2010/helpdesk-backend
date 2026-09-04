import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

/** Laravel Sanctum personal_access_tokens */
export class PersonalAccessToken extends Model {
  declare id: number
  declare tokenable_type: string
  declare tokenable_id: number
  declare name: string
  declare token: string
  declare abilities?: string
  declare last_used_at?: Date | null
  declare expires_at?: Date | null
}

export const initPersonalAccessTokenModel = () => {
  PersonalAccessToken.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      tokenable_type: DataTypes.STRING,
      tokenable_id: DataTypes.BIGINT.UNSIGNED,
      name: DataTypes.STRING,
      token: { type: DataTypes.STRING(64), unique: true },
      abilities: DataTypes.TEXT,
      last_used_at: DataTypes.DATE,
      expires_at: DataTypes.DATE,
    },
    { sequelize: getSequelize(), tableName: 'personal_access_tokens' }
  )
  return PersonalAccessToken
}
