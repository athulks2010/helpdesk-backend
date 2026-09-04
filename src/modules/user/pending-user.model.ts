import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class PendingUser extends Model {
  declare id: number
  declare first_name?: string
  declare last_name?: string
  declare email?: string
  declare password?: string
  declare role_id?: number

}

export const initPendingUserModel = () => {
  PendingUser.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role_id: DataTypes.BIGINT.UNSIGNED,

    },
    {
      sequelize: getSequelize(),
      tableName: 'pending_users',
    }
  )
  return PendingUser
}
