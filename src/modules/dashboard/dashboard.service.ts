import { Ticket } from '../ticket/ticket.model'
import { fn, col, literal } from 'sequelize'

export class DashboardService {
  async metrics() {
    const total = await Ticket.count()
    const open = await Ticket.count({ where: { close: null } as any }).catch(() => 0)
    const closed = await Ticket.count({
      where: literal('close IS NOT NULL') as any,
    }).catch(() => 0)

    let byStatus: any[] = []
    try {
      byStatus = await Ticket.findAll({
        attributes: ['status_id', [fn('COUNT', col('id')), 'count']],
        group: ['status_id'],
        raw: true,
      })
    } catch {
      byStatus = []
    }

    const recent = await Ticket.findAll({
      limit: 10,
      order: [['id', 'DESC']],
    })

    return {
      total,
      open,
      closed,
      byStatus,
      recent,
      message: 'Dashboard metrics fetched successfully',
    }
  }

  async analytics() {
    const metrics = await this.metrics()
    return {
      ticketsCreated: metrics.total,
      ticketsOpen: metrics.open,
      ticketsClosed: metrics.closed,
      statusBreakdown: metrics.byStatus,
      message: 'Dashboard analytics fetched successfully',
    }
  }

  async performance() {
    const total = await Ticket.count()
    const withFirstResponse = await Ticket.count({
      where: literal('response IS NOT NULL') as any,
    }).catch(() => 0)
    const resolved = await Ticket.count({
      where: literal('close IS NOT NULL') as any,
    }).catch(() => 0)

    return {
      total,
      firstResponseRate: total ? Number(((withFirstResponse / total) * 100).toFixed(2)) : 0,
      resolveRate: total ? Number(((resolved / total) * 100).toFixed(2)) : 0,
      message: 'Dashboard performance fetched successfully',
    }
  }

  async charts() {
    let byStatus: any[] = []
    let byPriority: any[] = []
    try {
      byStatus = await Ticket.findAll({
        attributes: ['status_id', [fn('COUNT', col('id')), 'count']],
        group: ['status_id'],
        raw: true,
      })
      byPriority = await Ticket.findAll({
        attributes: ['priority_id', [fn('COUNT', col('id')), 'count']],
        group: ['priority_id'],
        raw: true,
      })
    } catch {
      /* stub */
    }

    return {
      statusChart: byStatus,
      priorityChart: byPriority,
      message: 'Dashboard charts fetched successfully',
    }
  }
}
