import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class TicketEntry extends Model {
  declare id: number
  declare ticket_id: number
  declare field_id?: number
  declare name: string
  declare label?: string
  declare value: string
}

export const initTicketEntryModel = () => {
  TicketEntry.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      ticket_id: { type: DataTypes.INTEGER, allowNull: false },
      field_id: DataTypes.INTEGER,
      name: { type: DataTypes.STRING(100), allowNull: false },
      label: DataTypes.STRING(255),
      value: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize: getSequelize(),
      tableName: 'ticket_entries',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return TicketEntry
}
