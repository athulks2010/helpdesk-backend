import { TicketRepository } from './ticket.repository'

const repo = new TicketRepository()

export class TicketService {
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

  addComment(data: { ticket_id: number; body: string; user_id?: number; contact_id?: number }) {
    return repo.addComment(data)
  }

  getComments(ticketId: number | string) {
    return repo.getComments(ticketId)
  }

  getFavorites(userId: number) {
    return repo.getFavorites(userId)
  }

  addFavorite(userId: number, ticketId: number) {
    return repo.addFavorite(userId, ticketId)
  }

  removeFavorite(userId: number, ticketId: number) {
    return repo.removeFavorite(userId, ticketId)
  }
}
