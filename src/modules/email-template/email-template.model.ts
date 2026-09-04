import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class EmailTemplate extends Model {
  declare id: number
  declare name?: string
  declare details?: string
  declare slug?: string
  declare language?: string
  declare subject?: string
  declare body?: string
}

export const initEmailTemplateModel = () => {
  EmailTemplate.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      details: DataTypes.TEXT,
      slug: DataTypes.STRING,
      language: DataTypes.STRING,
      subject: DataTypes.STRING,
      body: DataTypes.TEXT,
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
