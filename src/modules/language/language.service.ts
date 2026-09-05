import { LanguageRepository } from './language.repository'

const repo = new LanguageRepository()

export class LanguageService {
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
    body.updated_at = new Date()
    return repo.update(body)
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }

  getTranslations(query: any) {
    return repo.getTranslations(query)
  }

  addPhrase(body: any) {
    return repo.addPhrase(body)
  }

  updatePhrase(body: any) {
    return repo.updatePhrase(body)
  }

  deletePhrase(queryOrBody: any) {
    return repo.deletePhrase(queryOrBody)
  }
}
