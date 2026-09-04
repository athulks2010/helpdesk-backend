import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Comment extends Model {
  declare id: number
  declare details?: string
  declare ticket_id?: number
  declare user_id?: number
  declare contact_id?: number
  declare createdAt?: Date
  declare updatedAt?: Date
  declare user?: any
  declare contact?: any

  get body() {
    return this.getDataValue('details')
  }
  set body(val: any) {
    this.setDataValue('details', val)
  }

  get message() {
    return this.getDataValue('details')
  }
  set message(val: any) {
    this.setDataValue('details', val)
  }

  get created_at() {
    const dateVal = this.getDataValue('createdAt') || (this as any).getDataValue('created_at')
    return dateVal ? new Date(dateVal).toISOString() : null
  }

  toJSON() {
    const values: any = super.toJSON()
    const text = this.getDataValue('details')
    values.body = text
    values.message = text

    const dateVal = this.getDataValue('createdAt') || (this as any).getDataValue('created_at')
    if (dateVal) {
      values.created_at = new Date(dateVal).toISOString()
    }

    const author = this.user || this.contact
    if (author) {
      const firstName = author.first_name || ''
      const lastName = author.last_name || ''
      const fullName = `${firstName} ${lastName}`.trim() || author.name || author.email || ''
      values.user = {
        first_name: firstName,
        last_name: lastName,
        name: fullName,
        email: author.email || '',
      }
    }

    return values
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
