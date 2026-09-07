import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class KnowledgeBase extends Model {
  declare id: number
  declare title?: string
  declare type_id?: number
  declare details?: string
  declare category?: string
  declare views?: number
  declare helpful?: number

  get content() {
    return this.getDataValue('details')
  }
  set content(val: any) {
    this.setDataValue('details', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    const details = this.getDataValue('details') || ''
    values.content = details
    const paragraph = String(details).match(/<p>([\s\S]*?)<\/p>/i)
    values.description = paragraph
      ? paragraph[1].replace(/<[^>]*>/g, '').trim()
      : String(details).replace(/<[^>]*>/g, '').trim()
    return values
  }
}

export const initKnowledgeBaseModel = () => {
  KnowledgeBase.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: DataTypes.STRING,
      details: DataTypes.TEXT,
      type_id: DataTypes.BIGINT.UNSIGNED,
      category: DataTypes.STRING,
      views: { type: DataTypes.INTEGER, defaultValue: 0 },
      helpful: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize: getSequelize(),
      tableName: 'knowledge_base',
      freezeTableName: true,
    }
  )
  return KnowledgeBase
}
