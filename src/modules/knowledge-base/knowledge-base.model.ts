import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class KnowledgeBase extends Model {
  declare id: number
  declare title?: string
  declare type_id?: number
  declare details?: string

  get content() {
    return this.getDataValue('details')
  }
  set content(val: any) {
    this.setDataValue('details', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.content = this.getDataValue('details')
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
    },
    {
      sequelize: getSequelize(),
      tableName: 'knowledge_base',
      freezeTableName: true,
    }
  )
  return KnowledgeBase
}
