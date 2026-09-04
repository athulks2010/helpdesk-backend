import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Priority extends Model {
  declare id: number
  declare name?: string
}

export const initPriorityModel = () => {
  Priority.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      sequelize: getSequelize(),
      tableName: 'priorities',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Priority
}
