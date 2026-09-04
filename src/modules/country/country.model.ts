import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Country extends Model {
  declare id: number
  declare code: string
  declare name: string
}

export const initCountryModel = () => {
  Country.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      code: { type: DataTypes.STRING(2), allowNull: false },
      name: { type: DataTypes.STRING(75), allowNull: false },
    },
    {
      sequelize: getSequelize(),
      tableName: 'countries',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Country
}
