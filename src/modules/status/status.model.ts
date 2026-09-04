import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Status extends Model {
  declare id: number
  declare name?: string
  declare slug?: string
}

export const initStatusModel = () => {
  Status.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    {
      sequelize: getSequelize(),
      tableName: 'status',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Status
}
