import { LanguageService } from './language.service'

export class LanguageController {
  private service = new LanguageService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Language fetched successfully' }
  }

  async create(body: any) {
    const item = await this.service.create(body)
    return { ...(item?.toJSON?.() || item), message: 'Language created successfully' }
  }

  async update(body: any) {
    const item = await this.service.update(body)
    return { ...(item?.toJSON?.() || item), message: 'Language updated successfully' }
  }

  async delete(query: any) {
    const item = await this.service.destroy(query.id)
    return { ...(item?.toJSON?.() || item), message: 'Language deleted successfully' }
  }

  async restore(body: any) {
    const item = await this.service.restore(body.id)
    return { ...(item?.toJSON?.() || item), message: 'Language restored successfully' }
  }

  async getTranslations(query: any) {
    const res = await this.service.getTranslations(query)
    return res
  }

  async addPhrase(body: any) {
    const res = await this.service.addPhrase(body)
    return res
  }

  async updatePhrase(body: any) {
    const res = await this.service.updatePhrase(body)
    return res
  }

  async deletePhrase(queryOrBody: any) {
    const res = await this.service.deletePhrase(queryOrBody)
    return res
  }
}
