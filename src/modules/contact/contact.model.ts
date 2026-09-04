import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Contact extends Model {
  declare id: number
  declare first_name?: string
  declare last_name?: string
  declare email?: string
  declare phone?: string
  declare organization_id?: number
  declare city?: string
  declare address?: string
  declare region?: string
  declare country?: string
  declare postal_code?: string
  declare countryDetails?: any
  declare organization?: any

  get country_name(): string | null {
    return (this as any).countryDetails?.name || null
  }

  get organization_name(): string | null {
    return (this as any).organization?.name || null
  }

  toJSON() {
    const values: any = super.toJSON()
    values.country_name = (this as any).countryDetails?.name || null
    values.organization_name = (this as any).organization?.name || null
    return values
  }
}

export const initContactModel = () => {
  Contact.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: { type: DataTypes.STRING, allowNull: false },
      phone: DataTypes.STRING,
      organization_id: DataTypes.BIGINT.UNSIGNED,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      region: DataTypes.STRING,
      country: DataTypes.STRING,
      postal_code: DataTypes.STRING,
    },
    {
      sequelize: getSequelize(),
      tableName: 'contacts',
      freezeTableName: true,
    }
  )
  return Contact
}
