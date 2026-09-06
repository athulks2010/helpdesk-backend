import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class EmailTemplate extends Model {
  declare id: number
  declare name?: string
  declare details?: string
  declare slug?: string
  declare language?: string
  declare html?: string

  get subject() {
    return this.getDataValue('name')
  }
  set subject(val: any) {
    this.setDataValue('name', val)
  }

  get body() {
    return this.getDataValue('html')
  }
  set body(val: any) {
    this.setDataValue('html', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.subject = this.getDataValue('name')
    values.body = this.getDataValue('html')
    return values
  }
}

export const initEmailTemplateModel = () => {
  EmailTemplate.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING(50),
      details: DataTypes.STRING(200),
      slug: DataTypes.STRING(50),
      language: DataTypes.STRING(10),
      html: DataTypes.TEXT,
    },
    {
      sequelize: getSequelize(),
      tableName: 'email_templates',
      freezeTableName: true,
      timestamps: false,
    }
  )
  return EmailTemplate
}
