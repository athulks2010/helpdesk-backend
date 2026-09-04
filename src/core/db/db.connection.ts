import { Sequelize } from 'sequelize'
import { log } from 'console'

let sequelize: Sequelize

export const getSequelize = () => sequelize

export const dbConnection = async () => {
  const host = process.env.DB_HOST || '127.0.0.1'
  const port = Number(process.env.DB_PORT || 3306)
  const database = process.env.DB_DATABASE || 'helpdesk'
  const username = process.env.DB_USERNAME || 'root'
  const password = process.env.DB_PASSWORD || ''

  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    timezone: process.env.APP_TIMEZONE || '+00:00',
    define: {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  })

  await sequelize.authenticate()
  log('MySQL : Connected')
  return sequelize
}
