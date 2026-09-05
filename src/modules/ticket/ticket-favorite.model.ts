import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class TicketFavorite extends Model {
  declare id: number
  declare user_id: number
  declare ticket_id: number
}

export const initTicketFavoriteModel = () => {
  TicketFavorite.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
      ticket_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      sequelize: getSequelize(),
      tableName: 'ticket_favorites',
    }
  )
  return TicketFavorite
}
