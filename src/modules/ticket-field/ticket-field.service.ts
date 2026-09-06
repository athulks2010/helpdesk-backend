import { TicketFieldRepository } from './ticket-field.repository'

const repo = new TicketFieldRepository()

export class TicketFieldService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  create(body: any) {
    if (body?.id) return repo.update(body)
    return repo.create(body)
  }

  update(body: any) {
    return repo.update(body)
  }

  destroy(id: number | string | Array<number | string>) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }

  persistEntries(ticketId: number, customInputs: Record<string, any> = {}, replaceExisting = false) {
    return repo.persistEntries(ticketId, customInputs, replaceExisting)
  }
}
