import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Department extends Model {
  declare id: number
  declare name?: string

}

export const initDepartmentModel = () => {
  Department.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,

    },
    {
      sequelize: getSequelize(),
      tableName: 'departments',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Department
}
