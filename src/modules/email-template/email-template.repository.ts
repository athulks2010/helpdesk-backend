import { Op } from 'sequelize'
import { EmailTemplate } from './email-template.model'
import { Exception } from '../../core'

export class EmailTemplateRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Email templates fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      let sortField = query?.sortField || 'id'
      if (sortField === 'subject') sortField = 'name'
      if (sortField === 'body') sortField = 'html'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

    if (query?.searchText) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.searchText}%` } },
        { details: { [Op.like]: `%${query.searchText}%` } },
        { slug: { [Op.like]: `%${query.searchText}%` } },
      ]
    }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          if (key === 'subject') where.name = query[key]
          else if (key === 'body') where.html = query[key]
          else where[key] = query[key]
        }
      }

      const { rows, count } = await EmailTemplate.findAndCountAll({
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
      result.message = err?.message || 'Failed to fetch email templates'
      return result
    }
  }

  async findById(id: number | string) {
    const item = await EmailTemplate.findByPk(id)
    if (!item) throw new Exception({ message: 'Email template not found', httpResponseCode: 404 })
    return item
  }

  mapPayload(body: any) {
    const payload = { ...body }
    if (payload.body !== undefined && payload.html === undefined) {
      payload.html = payload.body
    }
    if (payload.subject !== undefined && payload.name === undefined) {
      payload.name = payload.subject
    }
    delete payload.body
    delete payload.subject
    return payload
  }

  async create(body: any) {
    try {
      return await EmailTemplate.create(this.mapPayload(body))
    } catch (err: any) {
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

  async destroy(id: number | string) {
    try {
      const item = await this.findById(id)
      await item.destroy()
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async restore(_id: number | string) {
    throw new Exception({ message: 'Restore is not supported for Email template', httpResponseCode: 400 })
  }
}
