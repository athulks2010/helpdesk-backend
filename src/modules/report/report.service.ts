import { fn, col } from 'sequelize'
import { Ticket } from '../ticket/ticket.model'

export class ReportService {
  async generate(body: any = {}) {
    const where: any = {}
    if (body.status_id) where.status_id = body.status_id
    if (body.department_id) where.department_id = body.department_id
    if (body.from || body.to) {
      // date filters reserved for future use via created_at
    }

    const grouped = await Ticket.findAll({
      attributes: ['status_id', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['status_id'],
      raw: true,
    })

    const total = await Ticket.count({ where })

    return {
      report: {
        type: body.type || 'ticket_summary',
        total,
        byStatus: grouped,
        filters: body,
        generatedAt: new Date().toISOString(),
      },
      message: 'Report generated successfully',
    }
  }

  async show(query: any = {}) {
    return this.generate(query)
  }
}
