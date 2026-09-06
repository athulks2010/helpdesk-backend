import { Op } from 'sequelize'
import { Country } from './country.model'
import { Exception } from '../../core'

export class CountryRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Countries fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 300
      const sortField = query?.sortField || 'name'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

      if (query?.searchText) {
        where[Op.or] = [
          { name: { [Op.like]: `%${query.searchText}%` } },
          { code: { [Op.like]: `%${query.searchText}%` } },
        ]
      }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await Country.findAndCountAll({
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
      result.message = err?.message || 'Failed to fetch countries'
      return result
    }
  }

  async findById(id: number | string) {
    const where = isNaN(Number(id)) ? { code: String(id).toUpperCase() } : { id: Number(id) }
    const item = await Country.findOne({ where })
    if (!item) throw new Exception({ message: 'Country not found', httpResponseCode: 404 })
    return item
  }
}
