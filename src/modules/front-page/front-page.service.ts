import { FrontPageRepository } from './front-page.repository'

const repo = new FrontPageRepository()

export class FrontPageService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  findBySlug(slug: string) {
    return repo.findBySlug(slug)
  }

  create(body: any) {
    return repo.create(body)
  }

  update(body: any) {
    return repo.update(body)
  }

  updateBySlug(body: any) {
    return repo.updateBySlug(body)
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }
}
