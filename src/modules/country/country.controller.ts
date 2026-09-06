import { CountryService } from './country.service'

export class CountryController {
  private service = new CountryService()

  all(query: any) {
    return this.service.findAll(query)
  }

  async single(query: any) {
    const item = await this.service.findById(query.id || query.code)
    return { item, message: 'Country fetched successfully' }
  }
}
