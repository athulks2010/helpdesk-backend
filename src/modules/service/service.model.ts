import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Service extends Model {
  declare id: number
  declare title?: string
  declare slug?: string
  declare details?: string
  declare image?: string
  declare author_id?: number
  declare icon?: string
  declare is_active?: number

  get content() {
    return this.getDataValue('details')
  }
  set content(val: any) {
    this.setDataValue('details', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.content = this.getDataValue('details')
    const image = this.getDataValue('image')
    if (image) {
      if (/^https?:\/\//i.test(image)) {
        values.image_url = image
      } else {
        const base = (process.env.APP_URL || '').replace(/\/$/, '')
        const imagePath = image.startsWith('/') ? image : `/${image}`
        values.image_url = base ? `${base}${imagePath}` : imagePath
      }
    } else {
      values.image_url = null
    }

    const details = this.getDataValue('details') || ''
    const paragraph = details.match(/<p>([\s\S]*?)<\/p>/i)
    values.description = paragraph
      ? paragraph[1].replace(/<[^>]*>/g, '').trim()
      : String(details).replace(/<[^>]*>/g, '').trim()
    values.features = [...String(details).matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((match) =>
      match[1].replace(/<[^>]*>/g, '').trim()
    )
    return values
  }
}

export const initServiceModel = () => {
  Service.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      icon: DataTypes.STRING,
      author_id: DataTypes.BIGINT.UNSIGNED,
      is_active: { type: DataTypes.INTEGER, defaultValue: 1 },
      image: DataTypes.STRING,
      details: DataTypes.TEXT,
    },
    {
      sequelize: getSequelize(),
      tableName: 'services',
      freezeTableName: true,
    }
  )
  return Service
}
