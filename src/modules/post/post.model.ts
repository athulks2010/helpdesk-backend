import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Post extends Model {
  declare id: number
  declare title?: string
  declare author_id?: number
  declare is_active?: number
  declare image?: string
  declare type_id?: number
  declare details?: string

  get content() {
    return this.getDataValue('details')
  }
  set content(val: any) {
    this.setDataValue('details', val)
  }

  get cover() {
    return this.getDataValue('image')
  }
  set cover(val: any) {
    this.setDataValue('image', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.content = this.getDataValue('details')
    values.cover = this.getDataValue('image')
    return values
  }
}

export const initPostModel = () => {
  Post.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: DataTypes.STRING,
      author_id: DataTypes.BIGINT.UNSIGNED,
      is_active: { type: DataTypes.INTEGER, defaultValue: 1 },
      image: DataTypes.STRING,
      type_id: DataTypes.BIGINT.UNSIGNED,
      details: DataTypes.TEXT,
    },
    {
      sequelize: getSequelize(),
      tableName: 'posts',
      freezeTableName: true,
    }
  )
  return Post
}
