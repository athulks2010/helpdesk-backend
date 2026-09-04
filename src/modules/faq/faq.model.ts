import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Faq extends Model {
  declare id: number
  declare name?: string
  declare details?: string
  declare status?: number

  get question() {
    return this.getDataValue('name')
  }
  set question(val: any) {
    this.setDataValue('name', val)
  }

  get answer() {
    return this.getDataValue('details')
  }
  set answer(val: any) {
    this.setDataValue('details', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.question = this.getDataValue('name')
    values.answer = this.getDataValue('details')
    return values
  }
}

export const initFaqModel = () => {
  Faq.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      details: DataTypes.TEXT,
      status: { type: DataTypes.INTEGER, defaultValue: 1 },
    },
    {
      sequelize: getSequelize(),
      tableName: 'faqs',
      freezeTableName: true,
    }
  )
  return Faq
}
