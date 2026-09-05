import { TicketController } from './ticket.controller'
import { Router } from '../../core'

const ticketController = new TicketController()

export const ticketWithMiddleware = new Router()
ticketWithMiddleware.get('/all', async (req) => ticketController.all(req.query))
ticketWithMiddleware.get('/single', async (req) => ticketController.single(req.query))
ticketWithMiddleware.post('/create', async (req) => ticketController.create(req.body))
ticketWithMiddleware.put('/update', async (req) => ticketController.update(req.body))
ticketWithMiddleware.delete('/delete', async (req) => ticketController.destroy(req.query))
ticketWithMiddleware.post('/restore', async (req) => ticketController.restore(req.body))
ticketWithMiddleware.post('/comments', async (req) =>
  ticketController.addComment(req.body, (req as any).tokenHolder)
)
ticketWithMiddleware.get('/comments', async (req) => ticketController.getComments(req.query))

ticketWithMiddleware.get('/favorites', async (req) => ticketController.getFavorites(req.query, (req as any).tokenHolder))
ticketWithMiddleware.post('/favorites', async (req) => ticketController.addFavorite(req.body, (req as any).tokenHolder))
ticketWithMiddleware.delete('/favorites', async (req) => ticketController.removeFavorite(req.body, (req as any).tokenHolder))
