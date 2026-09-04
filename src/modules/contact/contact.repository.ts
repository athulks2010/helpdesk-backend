import { Op } from 'sequelize'
import { Contact } from './contact.model'
import { Country } from '../country/country.model'
import { Organization } from '../organization/organization.model'
import { Exception } from '../../core'

export class ContactRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Contacts fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      const sortField = query?.sortField || 'id'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

      if (query?.searchText) {
        where[Op.or] = [
          { first_name: { [Op.like]: `%${query.searchText}%` } },
          { last_name: { [Op.like]: `%${query.searchText}%` } },
          { email: { [Op.like]: `%${query.searchText}%` } },
          { phone: { [Op.like]: `%${query.searchText}%` } },
          { city: { [Op.like]: `%${query.searchText}%` } },
        ]
      }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await Contact.findAndCountAll({
        where,
        include: [
          { model: Country, as: 'countryDetails', attributes: ['id', 'code', 'name'], required: false },
          { model: Organization, as: 'organization', attributes: ['id', 'name'], required: false },
        ],
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
      result.message = err?.message || 'Failed to fetch contacts'
      return result
    }
  }

  async findById(id: number | string) {
    const item = await Contact.findByPk(id, {
      include: [
        { model: Country, as: 'countryDetails', attributes: ['id', 'code', 'name'], required: false },
        { model: Organization, as: 'organization', attributes: ['id', 'name'], required: false },
      ],
    })
    if (!item) throw new Exception({ message: 'Contact not found', httpResponseCode: 404 })
    return item
  }

  async create(body: any) {
    try {
      const payload = { ...body }
      if (payload.country && isNaN(Number(payload.country))) {
        const c = await Country.findOne({ where: { code: payload.country } })
        if (c) payload.country = String(c.id)
      }
      delete payload.photo_path
      const created = await Contact.create(payload)
      return await this.findById(created.id)
    } catch (err: any) {
      throw new Exception(err)
    }
  }

  async update(body: any) {
    try {
      const id = body?.id
      const item = await this.findById(id)
      const payload = { ...body }
      if (payload.country && isNaN(Number(payload.country))) {
        const c = await Country.findOne({ where: { code: payload.country } })
        if (c) payload.country = String(c.id)
      }
      delete payload.photo_path
      await item.update(payload)
      return await this.findById(id)
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
      const item = await Contact.findByPk(id, { paranoid: false })
      if (!item) throw new Exception({ message: 'Contact not found', httpResponseCode: 404 })
      await item.restore()
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }
}
