import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Category extends Model {
  declare id: number
  declare name?: string
  declare department_id?: number
  declare parent_id?: number
  declare color?: string
}

export const initCategoryModel = () => {
  Category.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      department_id: DataTypes.BIGINT.UNSIGNED,
      parent_id: DataTypes.BIGINT.UNSIGNED,
      color: DataTypes.STRING,
    },
    {
      sequelize: getSequelize(),
      tableName: 'categories',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return Category
}
