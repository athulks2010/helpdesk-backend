import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Message extends Model {
  declare id: number
  declare conversation_id?: number
  declare user_id?: number
  declare contact_id?: number
  declare message?: string
  declare is_read?: boolean

}

export const initMessageModel = () => {
  Message.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      conversation_id: DataTypes.BIGINT.UNSIGNED,
      user_id: DataTypes.BIGINT.UNSIGNED,
      contact_id: DataTypes.BIGINT.UNSIGNED,
      message: DataTypes.TEXT,
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },

    },
    {
      sequelize: getSequelize(),
      tableName: 'messages',
    }
  )
  return Message
}
