import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class MessageAttachment extends Model {
  declare id: number
  declare message_id?: number
  declare filename?: string
  declare file_path?: string
  declare mime_type?: string
  declare file_size?: number

  // Aliases for compatibility
  get name() {
    return this.getDataValue('filename')
  }
  set name(val: any) {
    this.setDataValue('filename', val)
  }

  get path() {
    return this.getDataValue('file_path')
  }
  set path(val: any) {
    this.setDataValue('file_path', val)
  }

  get mime() {
    return this.getDataValue('mime_type')
  }
  set mime(val: any) {
    this.setDataValue('mime_type', val)
  }

  get size() {
    return this.getDataValue('file_size')
  }
  set size(val: any) {
    this.setDataValue('file_size', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.name = this.getDataValue('filename')
    values.path = this.getDataValue('file_path')
    values.mime = this.getDataValue('mime_type')
    values.size = this.getDataValue('file_size')
    return values
  }
}

export const initMessageAttachmentModel = () => {
  MessageAttachment.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      message_id: DataTypes.INTEGER.UNSIGNED,
      filename: { type: DataTypes.STRING, allowNull: false },
      file_path: { type: DataTypes.STRING, allowNull: false },
      file_size: { type: DataTypes.BIGINT, allowNull: false },
      mime_type: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize: getSequelize(),
      tableName: 'message_attachments',
      timestamps: true,
    }
  )
  return MessageAttachment
}
