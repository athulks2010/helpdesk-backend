import { ServiceService } from './service.service'

const IMAGE_FIELDS = ['image', 'file', 'photo', 'cover']

const getUploadedFile = (req: any): Express.Multer.File | undefined => {
  if (req?.file) return req.file
  const files = req?.files
  if (!files) return undefined
  if (Array.isArray(files)) {
    return files.find((file) => IMAGE_FIELDS.includes(file.fieldname)) || files[0]
  }
  for (const field of IMAGE_FIELDS) {
    if (files[field]?.[0]) return files[field][0]
  }
  return undefined
}

export class ServiceController {
  private service = new ServiceService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Service fetched successfully' }
  }

  private payloadFromRequest(req: any) {
    const body = { ...(req.body || {}) }
    if (body.author_id == null && req.tokenHolder?.id) {
      body.author_id = req.tokenHolder.id
    }
    return body
  }

  async create(req: any) {
    const item = await this.service.create(this.payloadFromRequest(req), getUploadedFile(req))
    return { ...(item?.toJSON?.() || item), message: 'Service created successfully' }
  }

  async update(req: any) {
    const item = await this.service.update(this.payloadFromRequest(req), getUploadedFile(req))
    return { ...(item?.toJSON?.() || item), message: 'Service updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Service deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item), message: 'Service restored successfully' }
  }
}
