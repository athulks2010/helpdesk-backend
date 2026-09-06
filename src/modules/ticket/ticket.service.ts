import { Exception } from '../../core'
import { mailService } from '../../utils/mail'
import { User } from '../user/user.model'
import { TicketRepository } from './ticket.repository'

const repo = new TicketRepository()

export class TicketService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  async create(body: any) {
    if (!body.uid && !body.uuid) {
      body.uid = String(Math.floor(100000 + Math.random() * 900000))
    }

    const ticket = await repo.create(body)

    try {
      const email = await repo.getTicketEmail(ticket)
      if (email) {
        await mailService.sendTemplate('create_ticket_new_customer', email, {
          uid: ticket.uid,
          subject: ticket.subject,
          type: (ticket as any).type?.name,
          url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
        })
      }

      // Notify all admins
      const admins = await User.findAll({ where: { role_id: 1 } })
      for (const admin of admins) {
        if (admin.email) {
          await mailService.sendTemplate('create_ticket_admin', admin.email, {
            uid: ticket.uid,
            subject: ticket.subject,
            type: (ticket as any).type?.name,
            url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
          })
        }
      }

      // Notify assigned user if provided during creation
      if (ticket.assigned_to) {
        const assignee = await User.findByPk(ticket.assigned_to)
        if (assignee && assignee.email) {
          await mailService.sendTemplate('assigned_ticket', assignee.email, {
            uid: ticket.uid,
            subject: ticket.subject,
            type: (ticket as any).type?.name,
            url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
          })
        }
      }
    } catch (err) {
      console.error('[TicketService:create mail]', err)
    }

    return ticket
  }

  async update(body: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })

    const ticketBefore = await repo.findById(id)
    const oldAssignedTo = ticketBefore.assigned_to

    const ticket = await repo.update(body)

    try {
      if (body.assigned_to && body.assigned_to !== oldAssignedTo) {
        const assignee = await User.findByPk(body.assigned_to)
        if (assignee && assignee.email) {
          await mailService.sendTemplate('assigned_ticket', assignee.email, {
            uid: ticket.uid,
            subject: ticket.subject,
            type: (ticket as any).type?.name,
            url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
          })
        }
      }

      const email = await repo.getTicketEmail(ticket)
      if (email) {
        await mailService.sendTemplate('ticket_updated', email, {
          uid: ticket.uid,
          subject: ticket.subject,
          type: (ticket as any).type?.name,
          url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
        })
      }
    } catch (err) {
      console.error('[TicketService:update mail]', err)
    }

    return ticket
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }

  async addComment(data: { ticket_id: number; body?: string; details?: string; user_id?: number; contact_id?: number }) {
    const comment = await repo.addComment(data)

    try {
      const ticket = await repo.findById(data.ticket_id)
      const email = await repo.getTicketEmail(ticket)
      if (email) {
        await mailService.sendTemplate('ticket_new_comment', email, {
          uid: ticket.uid,
          subject: ticket.subject,
          type: (ticket as any).type?.name,
          name: (ticket as any).user?.first_name || (ticket as any).contact?.first_name || '',
          url: `${process.env.APP_URL || ''}/tickets/${ticket.id}/edit`,
          comment: (comment as any).details || '',
        })
      }
    } catch (err) {
      console.error('[TicketService:comment mail]', err)
    }

    return comment
  }

  getComments(ticketId: number | string) {
    return repo.getComments(ticketId)
  }

  getFavorites(userId: number, ticketId?: number) {
    return repo.getFavorites(userId, ticketId)
  }

  addFavorite(userId: number, ticketId: number) {
    return repo.addFavorite(userId, ticketId)
  }

  removeFavorite(userId: number, ticketId: number) {
    return repo.removeFavorite(userId, ticketId)
  }
}
