import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class FrontPage extends Model {
  declare id: number
  declare slug?: string
  declare title?: string
  declare is_active?: number
  declare html?: any

  get content() {
    return this.getDataValue('html')
  }
  set content(val: any) {
    this.setDataValue('html', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.content = this.getDataValue('html')
    return values
  }
}

export const initFrontPageModel = () => {
  FrontPage.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      slug: DataTypes.STRING(50),
      title: DataTypes.STRING(150),
      is_active: { type: DataTypes.INTEGER, defaultValue: 1 },
      html: DataTypes.JSON,
    },
    {
      sequelize: getSequelize(),
      tableName: 'front_pages',
      freezeTableName: true,
    }
  )
  return FrontPage
}
