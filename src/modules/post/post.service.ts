import { PostRepository } from './post.repository'

const repo = new PostRepository()

export class PostService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  create(body: any) {
    return repo.create(body)
  }

  update(body: any) {
    return repo.update(body)
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }
}
