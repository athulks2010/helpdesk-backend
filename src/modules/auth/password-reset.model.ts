import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class PasswordReset extends Model {
  declare email: string
  declare token: string
  declare created_at?: Date
}

export const initPasswordResetModel = () => {
  PasswordReset.init(
    {
      email: { type: DataTypes.STRING, primaryKey: true },
      token: DataTypes.STRING,
      created_at: DataTypes.DATE,
    },
    {
      sequelize: getSequelize(),
      tableName: 'password_resets',
      updatedAt: false,
      createdAt: 'created_at',
    }
  )
  return PasswordReset
}
