import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Organization extends Model {
  declare id: number
  declare name?: string
  declare email?: string
  declare phone?: string
  declare city?: string
  declare address?: string
  declare region?: string
  declare country?: string
  declare postal_code?: string
}

export const initOrganizationModel = () => {
  Organization.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      region: DataTypes.STRING,
      country: DataTypes.STRING,
      postal_code: DataTypes.STRING,
    },
    {
      sequelize: getSequelize(),
      tableName: 'organizations',
      freezeTableName: true,
    }
  )
  return Organization
}
