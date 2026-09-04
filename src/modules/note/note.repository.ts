import { Op } from 'sequelize'
import { Note } from './note.model'
import { Exception } from '../../core'

export class NoteRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Notes fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      let sortField = query?.sortField || 'id'
      if (sortField === 'title') sortField = 'name'
      if (sortField === 'content') sortField = 'details'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

      if (query?.searchText) {
        where[Op.or] = [
          { name: { [Op.like]: `%${query.searchText}%` } },
          { details: { [Op.like]: `%${query.searchText}%` } },
        ]
      }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await Note.findAndCountAll({
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
      result.message = err?.message || 'Failed to fetch notes'
      return result
    }
  }

  mapPayload(body: any) {
    const payload = { ...body }
    if (payload.title !== undefined && payload.name === undefined) {
      payload.name = payload.title
    }
    if (payload.content !== undefined && payload.details === undefined) {
      payload.details = payload.content
    }
    delete payload.title
    delete payload.content
    return payload
  }

  async findById(id: number | string) {
    const item = await Note.findByPk(id)
    if (!item) throw new Exception({ message: 'Note not found', httpResponseCode: 404 })
    return item
  }

  async create(body: any) {
    try {
      const payload = this.mapPayload(body)
      return await Note.create(payload)
    } catch (err: any) {
      throw new Exception(err)
    }
  }

  async update(body: any) {
    try {
      const id = body?.id
      const item = await this.findById(id)
      const payload = this.mapPayload(body)
      await item.update(payload)
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

  async restore(id: number | string) {
    try {
      const item = await Note.findByPk(id, { paranoid: false })
      if (!item) throw new Exception({ message: 'Note not found', httpResponseCode: 404 })
      await item.restore()
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }
}
