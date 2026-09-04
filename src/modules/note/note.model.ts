import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Note extends Model {
  declare id: number
  declare user_id?: number
  declare name?: string
  declare details?: string
  declare color?: string

  get title() {
    return this.getDataValue('name')
  }
  set title(val: any) {
    this.setDataValue('name', val)
  }

  get content() {
    return this.getDataValue('details')
  }
  set content(val: any) {
    this.setDataValue('details', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.title = this.getDataValue('name')
    values.content = this.getDataValue('details')
    return values
  }
}

export const initNoteModel = () => {
  Note.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING(100),
      details: DataTypes.TEXT,
      color: DataTypes.STRING(255),
      user_id: DataTypes.BIGINT.UNSIGNED,
    },
    {
      sequelize: getSequelize(),
      tableName: 'notes',
      freezeTableName: true,
    }
  )
  return Note
}
