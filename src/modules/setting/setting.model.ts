import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Setting extends Model {
  declare id: number
  declare name?: string
  declare slug?: string
  declare type?: string
  declare value?: string
}

export const initSettingModel = () => {
  Setting.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      type: DataTypes.STRING,
      value: DataTypes.TEXT,
    },
    {
      sequelize: getSequelize(),
      tableName: 'settings',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Setting
}
