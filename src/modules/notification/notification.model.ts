import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Notification extends Model {
  declare id: string
  declare type?: string
  declare notifiable_type?: string
  declare notifiable_id?: number
  declare data?: string
  declare read_at?: Date | null
}

export const initNotificationModel = () => {
  Notification.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      type: DataTypes.STRING,
      notifiable_type: DataTypes.STRING,
      notifiable_id: DataTypes.BIGINT.UNSIGNED,
      data: DataTypes.TEXT,
      read_at: DataTypes.DATE,
    },
    {
      sequelize: getSequelize(),
      tableName: 'notifications',
      updatedAt: false,
      createdAt: 'created_at',
    }
  )
  return Notification
}
