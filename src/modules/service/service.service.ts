import { ServiceRepository } from './service.repository'

const repo = new ServiceRepository()

export class ServiceService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  create(body: any, file?: Express.Multer.File) {
    return repo.create(body, file)
  }

  update(body: any, file?: Express.Multer.File) {
    return repo.update(body, file)
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }
}
