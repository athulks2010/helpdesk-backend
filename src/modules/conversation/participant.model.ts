import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Participant extends Model {
  declare id: number
  declare conversation_id?: number
  declare user_id?: number
  declare contact_id?: number
}

export const initParticipantModel = () => {
  Participant.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      conversation_id: DataTypes.BIGINT.UNSIGNED,
      user_id: DataTypes.BIGINT.UNSIGNED,
      contact_id: DataTypes.BIGINT.UNSIGNED,
    },
    {
      sequelize: getSequelize(),
      tableName: 'participants',
      timestamps: true,
    }
  )
  return Participant
}
