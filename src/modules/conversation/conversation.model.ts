import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Conversation extends Model {
  declare id: number
  declare title?: string
  declare status?: string
  declare last_message_at?: Date
  declare priority?: string
  declare department?: string
  declare source?: string
  declare metadata?: any
  declare last_activity?: Date
  declare contact_id?: number
  declare ticket_id?: number
  declare type?: string
  declare created_by?: number
  declare context?: any
  declare slug?: string

  // Alias for backwards compatibility
  get subject() {
    return this.getDataValue('title')
  }
  set subject(val: any) {
    this.setDataValue('title', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.subject = this.getDataValue('title')
    return values
  }
}

export const initConversationModel = () => {
  Conversation.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: DataTypes.STRING(100),
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'resolved', 'closed'),
        defaultValue: 'active',
      },
      last_message_at: DataTypes.DATE,
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium',
      },
      department: { type: DataTypes.STRING(50), defaultValue: 'general' },
      source: { type: DataTypes.STRING(50), defaultValue: 'website' },
      metadata: DataTypes.JSON,
      last_activity: DataTypes.DATE,
      contact_id: DataTypes.INTEGER.UNSIGNED,
      ticket_id: DataTypes.INTEGER.UNSIGNED,
      type: {
        type: DataTypes.ENUM('internal', 'customer', 'support'),
        defaultValue: 'internal',
      },
      created_by: DataTypes.INTEGER.UNSIGNED,
      context: DataTypes.JSON,
      slug: DataTypes.STRING(100),
    },
    {
      sequelize: getSequelize(),
      tableName: 'conversations',
    }
  )
  return Conversation
}
