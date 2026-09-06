import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'
import { User } from '../user/user.model'
import { Status } from '../status/status.model'
import { Priority } from '../priority/priority.model'
import { Department } from '../department/department.model'
import { Category } from '../category/category.model'
import { Type } from '../type/type.model'

export class TicketActivity extends Model {
  declare id: number
  declare ticket_id: number
  declare user_id?: number
  declare activity_type: string
  declare field_name?: string
  declare old_value?: string
  declare new_value?: string
  declare description?: string
  declare metadata?: any
}

const FIELD_LABELS: Record<string, string> = {
  status_id: 'Status',
  priority_id: 'Priority',
  assigned_to: 'Assignment',
  department_id: 'Department',
  category_id: 'Category',
  type_id: 'Type',
  subject: 'Subject',
  details: 'Description',
  due: 'Due Date',
  impact_level: 'Impact Level',
  urgency_level: 'Urgency Level',
}

const formatValue = (value: any) => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

const userName = (user: any) => {
  if (!user) return 'Unassigned'
  const full = `${user.first_name || ''} ${user.last_name || ''}`.trim()
  return full || user.name || user.email || `User #${user.id}`
}

export const createTicketActivity = async (data: {
  ticket_id: number
  user_id?: number | null
  activity_type: string
  field_name?: string | null
  old_value?: any
  new_value?: any
  description?: string
  metadata?: any
}) => {
  return TicketActivity.create({
    ticket_id: data.ticket_id,
    user_id: data.user_id || null,
    activity_type: data.activity_type,
    field_name: data.field_name || null,
    old_value: formatValue(data.old_value),
    new_value: formatValue(data.new_value),
    description: data.description,
    metadata: data.metadata || null,
  })
}

export const logTicketCreated = (ticket: any, userId?: number | null) => {
  return createTicketActivity({
    ticket_id: ticket.id,
    user_id: userId,
    activity_type: 'created',
    description: `Ticket #${ticket.uid || ticket.id} was created`,
  })
}

export const logTicketAssignment = async (
  ticket: any,
  oldAssigneeId: any,
  newAssigneeId: any,
  userId?: number | null
) => {
  const oldAssignee = oldAssigneeId ? await User.findByPk(oldAssigneeId) : null
  const newAssignee = newAssigneeId ? await User.findByPk(newAssigneeId) : null
  const oldName = userName(oldAssignee)
  const newName = userName(newAssignee)

  let description = 'Ticket assignment updated'
  if (oldAssigneeId && newAssigneeId) description = `Ticket reassigned from ${oldName} to ${newName}`
  else if (newAssigneeId) description = `Ticket assigned to ${newName}`
  else if (oldAssigneeId) description = `Ticket unassigned from ${oldName}`

  return createTicketActivity({
    ticket_id: ticket.id,
    user_id: userId,
    activity_type: 'assigned',
    field_name: 'assigned_to',
    old_value: oldAssigneeId,
    new_value: newAssigneeId,
    description,
  })
}

export const logTicketStatusChange = async (
  ticket: any,
  oldStatusId: any,
  newStatusId: any,
  userId?: number | null
) => {
  const oldStatus = oldStatusId ? await Status.findByPk(oldStatusId) : null
  const newStatus = newStatusId ? await Status.findByPk(newStatusId) : null
  const oldName = oldStatus?.name || 'None'
  const newName = newStatus?.name || 'None'
  return createTicketActivity({
    ticket_id: ticket.id,
    user_id: userId,
    activity_type: 'status_changed',
    field_name: 'status_id',
    old_value: oldStatusId,
    new_value: newStatusId,
    description: `Status changed from ${oldName} to ${newName}`,
  })
}

const lookupName = async (field: string, id: any) => {
  if (!id) return null
  if (field === 'priority_id') return (await Priority.findByPk(id))?.name || id
  if (field === 'department_id') return (await Department.findByPk(id))?.name || id
  if (field === 'category_id') return (await Category.findByPk(id))?.name || id
  if (field === 'type_id') return (await Type.findByPk(id))?.name || id
  return id
}

export const logTicketFieldChange = async (
  ticket: any,
  fieldName: string,
  oldValue: any,
  newValue: any,
  userId?: number | null
) => {
  const label = FIELD_LABELS[fieldName] || fieldName.replace(/_/g, ' ')
  const oldDisplay = await lookupName(fieldName, oldValue)
  const newDisplay = await lookupName(fieldName, newValue)
  let description = `${label} changed`
  if (oldDisplay && newDisplay) description += ` from '${oldDisplay}' to '${newDisplay}'`
  else if (newDisplay) description += ` to '${newDisplay}'`

  return createTicketActivity({
    ticket_id: ticket.id,
    user_id: userId,
    activity_type: 'field_changed',
    field_name: fieldName,
    old_value: oldValue,
    new_value: newValue,
    description,
  })
}

export const logTicketComment = (ticket: any, commentId: any, userId?: number | null) => {
  return createTicketActivity({
    ticket_id: ticket.id,
    user_id: userId,
    activity_type: 'commented',
    field_name: 'comment_id',
    new_value: commentId,
    description: 'A comment was added',
  })
}

export const initTicketActivityModel = () => {
  TicketActivity.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      ticket_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      user_id: DataTypes.BIGINT.UNSIGNED,
      activity_type: { type: DataTypes.STRING(50), allowNull: false },
      field_name: DataTypes.STRING(100),
      old_value: DataTypes.TEXT,
      new_value: DataTypes.TEXT,
      description: DataTypes.TEXT,
      metadata: DataTypes.JSON,
    },
    {
      sequelize: getSequelize(),
      tableName: 'ticket_activities',
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  return TicketActivity
}
