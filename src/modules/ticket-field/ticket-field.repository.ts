import { Op } from 'sequelize'
import { Exception } from '../../core'
import { TicketField } from './ticket-field.model'
import { TicketEntry } from '../ticket/ticket-entry.model'

export class TicketFieldRepository {
  mapPayload(body: any) {
    const payload: any = {
      type: body?.type,
      label: body?.label,
      name: body?.name,
      placeholder: body?.placeholder ?? null,
      required: body?.required === true || body?.required === 1 || body?.required === '1' ? 1 : 0,
      hint: body?.hint ?? null,
    }
    if (body?.options !== undefined) {
      if (body.options === null || body.options === '') {
        payload.options = null
      } else if (typeof body.options === 'string') {
        payload.options = body.options
      } else {
        payload.options = JSON.stringify(body.options)
      }
    } else {
      payload.options = null
    }
    return payload
  }

  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Ticket fields fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 100
      const sortField = query?.sortField || 'id'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

      if (query?.searchText) {
        where[Op.or] = [
          { name: { [Op.like]: `%${query.searchText}%` } },
          { label: { [Op.like]: `%${query.searchText}%` } },
          { type: { [Op.like]: `%${query.searchText}%` } },
        ]
      }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await TicketField.findAndCountAll({
        where,
        order: [[sortField, sortOrder]],
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
      })

      result.items = rows
      result.totalCount = count
      return result
    } catch (err: any) {
      result.items = []
      result.totalCount = 0
      result.message = err?.message || 'Failed to fetch ticket fields'
      return result
    }
  }

  async findById(id: number | string) {
    const item = await TicketField.findByPk(id)
    if (!item) throw new Exception({ message: 'Ticket field not found', httpResponseCode: 404 })
    return item
  }

  async create(body: any) {
    try {
      if (!body?.type || !body?.label || !body?.name) {
        throw new Exception({ message: 'type, label and name are required', httpResponseCode: 422 })
      }
      return await TicketField.create(this.mapPayload(body))
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async update(body: any) {
    try {
      const id = body?.id
      const item = await this.findById(id)
      await item.update(this.mapPayload(body))
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async destroy(id: number | string | Array<number | string>) {
    try {
      const ids = Array.isArray(id) ? id : [id]
      const items = await TicketField.findAll({ where: { id: ids } })
      if (!items.length) throw new Exception({ message: 'Ticket field not found', httpResponseCode: 404 })
      await TicketField.destroy({ where: { id: ids } })
      return items.length === 1 ? items[0] : items
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async restore(_id: number | string) {
    throw new Exception({ message: 'Restore is not supported for Ticket field', httpResponseCode: 400 })
  }

  normalizeValue(fieldType: string | undefined, rawValue: any): string | null {
    if (fieldType === 'checkbox' && Array.isArray(rawValue)) {
      return rawValue.length ? JSON.stringify(rawValue) : null
    }
    if (Array.isArray(rawValue)) {
      return rawValue.length ? JSON.stringify(rawValue) : null
    }
    if (rawValue === undefined || rawValue === null || rawValue === '') return null
    if (typeof rawValue === 'object') return JSON.stringify(rawValue)
    return String(rawValue)
  }

  async persistEntries(ticketId: number, customInputs: Record<string, any> = {}, replaceExisting = false) {
    if (!customInputs || typeof customInputs !== 'object' || Array.isArray(customInputs)) return []
    if (replaceExisting) {
      await TicketEntry.destroy({ where: { ticket_id: ticketId } })
    }

    const created: TicketEntry[] = []
    for (const [name, rawValue] of Object.entries(customInputs)) {
      const field = await TicketField.findOne({ where: { name } })
      if (!field) continue
      const value = this.normalizeValue(field.type, rawValue)
      if (value === null) continue
      const entry = await TicketEntry.create({
        ticket_id: ticketId,
        field_id: field.id,
        name,
        label: field.label,
        value,
      })
      created.push(entry)
    }
    return created
  }
}
