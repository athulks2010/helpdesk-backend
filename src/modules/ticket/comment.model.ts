import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Comment extends Model {
  declare id: number
  declare details?: string
  declare ticket_id?: number
  declare user_id?: number
  declare contact_id?: number

  get body() {
    return this.getDataValue('details')
  }
  set body(val: any) {
    this.setDataValue('details', val)
  }
}

export const initCommentModel = () => {
  Comment.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      details: DataTypes.TEXT,
      ticket_id: DataTypes.BIGINT.UNSIGNED,
      user_id: DataTypes.BIGINT.UNSIGNED,
      contact_id: DataTypes.BIGINT.UNSIGNED,
    },
    {
      sequelize: getSequelize(),
      tableName: 'comments',
      freezeTableName: true,
    }
  )
  return Comment
}
