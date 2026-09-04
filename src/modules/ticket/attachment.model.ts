import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Attachment extends Model {
  declare id: number
  declare ticket_id?: number
  declare conversation_id?: number
  declare user_id?: number
  declare name?: string
  declare path?: string
  declare mime?: string
  declare size?: number
}

export const initAttachmentModel = () => {
  Attachment.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      ticket_id: DataTypes.BIGINT.UNSIGNED,
      conversation_id: DataTypes.BIGINT.UNSIGNED,
      user_id: DataTypes.BIGINT.UNSIGNED,
      name: DataTypes.STRING,
      path: DataTypes.STRING,
      mime: DataTypes.STRING,
      size: DataTypes.INTEGER,
    },
    {
      sequelize: getSequelize(),
      tableName: 'attachments',
    }
  )
  return Attachment
}
