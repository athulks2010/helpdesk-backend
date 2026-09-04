import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class Ticket extends Model {
  declare id: number
  declare uid?: string
  declare subject?: string
  declare parent_id?: number
  declare status_id?: number
  declare open?: Date
  declare due?: Date | null
  declare close?: Date | null
  declare response?: Date | null
  declare user_id?: number
  declare contact_id?: number
  declare created_by?: string
  declare priority_id?: number
  declare department_id?: number
  declare category_id?: number
  declare sub_category_id?: number
  declare assigned_to?: number
  declare type_id?: number
  declare impact_level?: string
  declare urgency_level?: string
  declare parent_ticket_id?: number
  declare template_id?: number
  declare sla_policy_id?: number
  declare details?: string

  // Aliases for backwards compatibility
  get uuid() {
    return this.getDataValue('uid')
  }
  set uuid(val: any) {
    this.setDataValue('uid', val)
  }

  get body() {
    return this.getDataValue('details')
  }
  set body(val: any) {
    this.setDataValue('details', val)
  }

  get closed_at() {
    return this.getDataValue('close')
  }
  set closed_at(val: any) {
    this.setDataValue('close', val)
  }

  get first_response_at() {
    return this.getDataValue('response')
  }
  set first_response_at(val: any) {
    this.setDataValue('response', val)
  }

  get impact() {
    return this.getDataValue('impact_level')
  }
  set impact(val: any) {
    this.setDataValue('impact_level', val)
  }

  get urgency() {
    return this.getDataValue('urgency_level')
  }
  set urgency(val: any) {
    this.setDataValue('urgency_level', val)
  }

  get resolve_by() {
    return this.getDataValue('due')
  }
  set resolve_by(val: any) {
    this.setDataValue('due', val)
  }

  get custom_field() {
    return this.getDataValue('custom_fields')
  }
  set custom_field(val: any) {
    this.setDataValue('custom_fields', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.body = this.getDataValue('details')
    values.uuid = this.getDataValue('uid')
    values.custom_field = this.getDataValue('custom_fields')
    return values
  }
}

export const initTicketModel = () => {
  Ticket.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      uid: DataTypes.STRING,
      subject: DataTypes.STRING,
      parent_id: DataTypes.INTEGER,
      status_id: DataTypes.INTEGER,
      open: DataTypes.DATE,
      due: DataTypes.DATE,
      close: DataTypes.DATE,
      response: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
      contact_id: DataTypes.INTEGER,
      created_by: DataTypes.STRING,
      priority_id: DataTypes.INTEGER,
      department_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      sub_category_id: DataTypes.INTEGER,
      assigned_to: DataTypes.INTEGER,
      type_id: DataTypes.INTEGER,
      impact_level: DataTypes.STRING,
      urgency_level: DataTypes.STRING,
      parent_ticket_id: DataTypes.BIGINT.UNSIGNED,
      template_id: DataTypes.BIGINT.UNSIGNED,
      sla_policy_id: DataTypes.BIGINT.UNSIGNED,
      details: DataTypes.TEXT,
    },
    {
      sequelize: getSequelize(),
      tableName: 'tickets',
      freezeTableName: true,
    }
  )
  return Ticket
}
