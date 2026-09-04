import { Op } from 'sequelize'
import { Faq } from './faq.model'
import { Exception } from '../../core'

export class FaqRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Faqs fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      const sortField = query?.sortField || 'id'
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

      const { rows, count } = await Faq.findAndCountAll({
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
      result.message = err?.message || 'Failed to fetch faqs'
      return result
    }
  }

  mapFaqPayload(body: any) {
    const payload = { ...body }
    if (payload.question !== undefined && payload.name === undefined) {
      payload.name = payload.question
    }
    if (payload.answer !== undefined && payload.details === undefined) {
      payload.details = payload.answer
    }
    if (payload.status !== undefined) {
      if (typeof payload.status === 'boolean') {
        payload.status = payload.status ? 1 : 0
      } else if (typeof payload.status === 'string') {
        payload.status = payload.status === 'true' || payload.status === '1' ? 1 : 0
      }
    }
    delete payload.question
    delete payload.answer
    delete payload.order
    return payload
  }

  async findById(id: number | string) {
    const item = await Faq.findByPk(id)
    if (!item) throw new Exception({ message: 'Faq not found', httpResponseCode: 404 })
    return item
  }

  async create(body: any) {
    try {
      const payload = this.mapFaqPayload(body)
      return await Faq.create(payload)
    } catch (err: any) {
      throw new Exception(err)
    }
  }

  async update(body: any) {
    try {
      const id = body?.id
      const item = await this.findById(id)
      const payload = this.mapFaqPayload(body)
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
      const item = await Faq.findByPk(id, { paranoid: false })
      if (!item) throw new Exception({ message: 'Faq not found', httpResponseCode: 404 })
      await item.restore()
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }
}
