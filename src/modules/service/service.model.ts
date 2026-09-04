import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Service extends Model {
  declare id: number
  declare title?: string
  declare slug?: string
  declare details?: string
  declare image?: string
  declare author_id?: number
  declare icon?: string
  declare is_active?: number

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

export const initServiceModel = () => {
  Service.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      icon: DataTypes.STRING,
      author_id: DataTypes.BIGINT.UNSIGNED,
      is_active: { type: DataTypes.INTEGER, defaultValue: 1 },
      image: DataTypes.STRING,
      details: DataTypes.TEXT,
    },
    {
      sequelize: getSequelize(),
      tableName: 'services',
      freezeTableName: true,
    }
  )
  return Service
}
