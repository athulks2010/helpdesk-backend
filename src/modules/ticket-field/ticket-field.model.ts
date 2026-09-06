import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class TicketField extends Model {
  declare id: number
  declare type: string
  declare label?: string
  declare name?: string
  declare placeholder?: string
  declare options?: string | any
  declare required?: number
  declare hint?: string

  toJSON() {
    const values: any = super.toJSON()
    if (typeof values.options === 'string') {
      try {
        values.options = JSON.parse(values.options)
      } catch {
        /* keep raw */
      }
    }
    values.required = Number(values.required || 0)
    return values
  }
}

export const initTicketFieldModel = () => {
  TicketField.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      type: { type: DataTypes.STRING(50), allowNull: false },
      label: DataTypes.STRING(255),
      name: DataTypes.STRING(100),
      placeholder: DataTypes.STRING(255),
      options: DataTypes.TEXT,
      required: { type: DataTypes.TINYINT, defaultValue: 0 },
      hint: DataTypes.STRING(255),
    },
    {
      sequelize: getSequelize(),
      tableName: 'ticket_fields',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return TicketField
}
