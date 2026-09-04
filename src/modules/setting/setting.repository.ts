import { Op } from 'sequelize'
import { Setting } from './setting.model'
import { Exception } from '../../core'

export class SettingRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Settings fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      const sortField = query?.sortField || 'id'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

    if (query?.searchText) {
      where[Op.or] = [
        { slug: { [Op.like]: `%${query.searchText}%` } },
        { value: { [Op.like]: `%${query.searchText}%` } },
      ]
    }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await Setting.findAndCountAll({
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
      result.message = err?.message || 'Failed to fetch settings'
      return result
    }
  }

  async findById(id: number | string) {
    const item = await Setting.findByPk(id)
    if (!item) throw new Exception({ message: 'Setting not found', httpResponseCode: 404 })
    return item
  }

  async create(body: any) {
    try {
      return await Setting.create(body)
    } catch (err: any) {
      throw new Exception(err)
    }
  }

  async update(body: any) {
    try {
      const id = body?.id
      const item = await this.findById(id)
      await item.update(body)
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

  async updateSmtp(body: any) {
    try {
      let itemsToUpdate: { slug: string; value: any }[] = []

      if (Array.isArray(body)) {
        itemsToUpdate = body
      } else if (body && Array.isArray(body.settings)) {
        itemsToUpdate = body.settings
      } else if (body && typeof body.settings === 'object' && body.settings !== null) {
        itemsToUpdate = Object.entries(body.settings).map(([slug, value]) => ({ slug, value }))
      } else if (body && typeof body === 'object') {
        itemsToUpdate = Object.entries(body).map(([slug, value]) => ({ slug, value }))
      }

      const updatedSettings: any[] = []
      for (const item of itemsToUpdate) {
        if (!item.slug) continue
        const valStr = item.value !== undefined && item.value !== null ? String(item.value) : ''
        
        let setting = await Setting.findOne({ where: { slug: item.slug } })
        if (setting) {
          await setting.update({ value: valStr })
        } else {
          setting = await Setting.create({ slug: item.slug, value: valStr })
        }
        updatedSettings.push(setting)
      }

      return { items: updatedSettings, message: 'SMTP settings updated successfully' }
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async restore(_id: number | string) {
    throw new Exception({ message: 'Restore is not supported for Setting', httpResponseCode: 400 })
  }
}
