import { DataTypes, Model, Optional } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export interface RoleAttrs {
  id: number
  name?: string
  slug?: string
  access?: any
  created_at?: Date
  updated_at?: Date
}

export class Role extends Model<RoleAttrs> implements RoleAttrs {
  declare id: number
  declare name?: string
  declare slug?: string
  declare access?: any
}

export const initRoleModel = () => {
  Role.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      slug: { type: DataTypes.STRING, unique: true },
      access: DataTypes.JSON,
    },
    { sequelize: getSequelize(), tableName: 'roles' }
  )
  return Role
}
