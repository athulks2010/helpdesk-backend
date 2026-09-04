import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Language extends Model {
  declare id: number
  declare name?: string
  declare code?: string
  declare flag?: string
  declare updated_at?: Date
}

export const initLanguageModel = () => {
  Language.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      flag: DataTypes.STRING,
      updated_at: DataTypes.DATE,
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
