import { CountryRepository } from './country.repository'

const repo = new CountryRepository()

export class CountryService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }
}
