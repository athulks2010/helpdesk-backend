import { Op } from 'sequelize'
import { FrontPage } from './front-page.model'
import { Exception } from '../../core'

export class FrontPageRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Front pages fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      const sortField = query?.sortField || 'id'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

      if (query?.searchText) {
        where[Op.or] = [
          { slug: { [Op.like]: `%${query.searchText}%` } },
          { title: { [Op.like]: `%${query.searchText}%` } },
        ]
      }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await FrontPage.findAndCountAll({
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
      result.message = err?.message || 'Failed to fetch front pages'
      return result
    }
  }

  mapPayload(body: any) {
    const payload = { ...body }
    if (payload.content !== undefined && payload.html === undefined) {
      payload.html = payload.content
    }
    delete payload.content
    delete payload.meta
    return payload
  }

  async findById(id: number | string) {
    const item = await FrontPage.findByPk(id)
    if (!item) throw new Exception({ message: 'Front page not found', httpResponseCode: 404 })
    return item
  }

  async create(body: any) {
    try {
      const payload = this.mapPayload(body)
      return await FrontPage.create(payload)
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

  async restore(_id: number | string) {
    throw new Exception({ message: 'Restore is not supported for Front page', httpResponseCode: 400 })
  }
}
