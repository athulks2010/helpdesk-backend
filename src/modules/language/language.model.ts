import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Language extends Model {
  declare id: number
  declare name?: string
  declare code?: string
  declare flag?: string
}

export const initLanguageModel = () => {
  Language.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      flag: DataTypes.STRING,
    },
    {
      sequelize: getSequelize(),
      tableName: 'languages',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Language
}
