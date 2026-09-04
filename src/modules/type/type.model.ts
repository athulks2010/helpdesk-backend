import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Type extends Model {
  declare id: number
  declare name?: string
}

export const initTypeModel = () => {
  Type.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      sequelize: getSequelize(),
      tableName: 'types',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Type
}
