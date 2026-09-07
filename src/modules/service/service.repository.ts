import { Op } from 'sequelize'
import { Service } from './service.model'
import { Exception } from '../../core'
import { FileUploadService } from '../file-upload/file-upload.service'

const fileUploadService = new FileUploadService()

export class ServiceRepository {
  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Services fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      const sortField = query?.sortField || 'id'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

      if (query?.searchText) {
        where[Op.or] = [
          { title: { [Op.like]: `%${query.searchText}%` } },
          { slug: { [Op.like]: `%${query.searchText}%` } },
          { details: { [Op.like]: `%${query.searchText}%` } },
        ]
      }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await Service.findAndCountAll({
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
      result.message = err?.message || 'Failed to fetch services'
      return result
    }
  }

  mapServicePayload(body: any) {
    const payload: any = {}
    if (body?.title !== undefined) payload.title = body.title
    if (body?.slug !== undefined) payload.slug = body.slug
    if (body?.icon !== undefined) payload.icon = body.icon
    if (body?.author_id !== undefined) payload.author_id = body.author_id
    if (body?.details !== undefined) payload.details = body.details
    else if (body?.content !== undefined) payload.details = body.content

    if (body?.is_active !== undefined && body.is_active !== '') {
      const value = body.is_active
      if (value === 0 || value === '0' || value === false || value === 'false' || value === 'off') {
        payload.is_active = 0
      } else {
        payload.is_active = 1
      }
    }

    return payload
  }

  private async generateUniqueSlug(title: string, ignoreId?: number | string) {
    const base =
      String(title || 'service')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'service'
    let slug = base
    let counter = 1

    while (true) {
      const where: any = { slug }
      if (ignoreId != null && ignoreId !== '') {
        where.id = { [Op.ne]: ignoreId }
      }
      const exists = await Service.findOne({ where })
      if (!exists) return slug
      slug = `${base}-${counter}`
      counter += 1
    }
  }

  async resolveImage(body: any, file?: Express.Multer.File) {
    if (file) {
      const uploaded = await fileUploadService.upload(file, { folder: 'services' })
      return uploaded.item?.path
    }

    const raw = body?.image ?? body?.photo ?? body?.cover
    if (raw == null || raw === '') return undefined

    if (typeof raw === 'object' && typeof raw.path === 'string' && raw.path) {
      return String(raw.path).slice(0, 250)
    }

    if (typeof raw !== 'string') return undefined

    if (raw.startsWith('data:image/')) {
      const match = raw.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/)
      if (!match) return undefined
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1].replace('svg+xml', 'svg')
      const buffer = Buffer.from(match[2], 'base64')
      const filename = `${Date.now()}-upload.${ext}`
      return fileUploadService.saveBuffer(buffer, 'services', filename)
    }

    if (raw.length > 250) return undefined
    return raw
  }

  async findById(id: number | string) {
    const item = await Service.findByPk(id)
    if (!item) throw new Exception({ message: 'Service not found', httpResponseCode: 404 })
    return item
  }

  async create(body: any, file?: Express.Multer.File) {
    try {
      const payload = this.mapServicePayload(body)
      const imagePath = await this.resolveImage(body, file)
      if (imagePath) payload.image = imagePath

      if (!payload.slug && payload.title) {
        payload.slug = await this.generateUniqueSlug(payload.title)
      }

      return await Service.create(payload)
    } catch (err: any) {
      throw new Exception(err)
    }
  }

  async update(body: any, file?: Express.Multer.File) {
    try {
      const id = body?.id
      const item = await this.findById(id)
      const payload = this.mapServicePayload(body)
      const imagePath = await this.resolveImage(body, file)

      if (imagePath) {
        if (item.image && item.image !== imagePath) {
          fileUploadService.deletePublicPath(item.image)
        }
        payload.image = imagePath
      }

      if (payload.title && payload.title !== item.title && !payload.slug) {
        payload.slug = await this.generateUniqueSlug(payload.title, id)
      } else if (payload.slug && payload.slug !== item.slug) {
        payload.slug = await this.generateUniqueSlug(payload.slug, id)
      }

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
      const item = await Service.findByPk(id, { paranoid: false })
      if (!item) throw new Exception({ message: 'Service not found', httpResponseCode: 404 })
      await item.restore()
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }
}
