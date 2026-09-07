import { Op, fn, col, literal, QueryTypes } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'
import { Ticket } from '../ticket/ticket.model'
import { TicketActivity } from '../ticket/ticket-activity.model'
import { User } from '../user/user.model'
import { Contact } from '../contact/contact.model'
import { Role } from '../role/role.model'
import { Status } from '../status/status.model'
import { Priority } from '../priority/priority.model'
import { Department } from '../department/department.model'
import { Type } from '../type/type.model'
import { Conversation } from '../conversation/conversation.model'
import { Message } from '../conversation/message.model'

const PALETTE = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#64748b']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export class DashboardService {
  private getUserFilter(tokenHolder?: any): any {
    if (!tokenHolder) return {}
    const roleSlug = (tokenHolder.role?.slug || '').toLowerCase()
    const roleId = tokenHolder.role_id

    if (roleSlug === 'customer' || roleId === 2) {
      return {
        [Op.or]: [
          { user_id: tokenHolder.id },
          { contact_id: tokenHolder.id },
        ],
      }
    } else if (roleSlug === 'agent') {
      return { assigned_to: tokenHolder.id }
    }
    return {}
  }

  private buildRoleWhereSql(tokenHolder?: any, prefix = ''): string {
    if (!tokenHolder) return ''
    const roleSlug = (tokenHolder.role?.slug || '').toLowerCase()
    const roleId = tokenHolder.role_id
    const colPrefix = prefix ? `${prefix}.` : ''

    if (roleSlug === 'customer' || roleId === 2) {
      const uid = Number(tokenHolder.id) || 0
      return `WHERE (${colPrefix}user_id = ${uid} OR ${colPrefix}contact_id = ${uid})`
    } else if (roleSlug === 'agent') {
      const aid = Number(tokenHolder.id) || 0
      return `WHERE ${colPrefix}assigned_to = ${aid}`
    }
    return ''
  }

  private formatDuration(seconds: number | null | undefined): string[] {
    if (!seconds || seconds <= 0 || isNaN(seconds)) {
      return ['0', 'minutes']
    }
    const sec = Math.round(seconds)
    if (sec < 60) {
      return [String(sec), sec === 1 ? 'second' : 'seconds']
    }
    const mins = Math.round(sec / 60)
    if (mins < 60) {
      return [String(mins), mins === 1 ? 'minute' : 'minutes']
    }
    const hours = Math.round((sec / 3600) * 10) / 10
    if (hours < 24) {
      return [String(hours), hours === 1 ? 'hour' : 'hours']
    }
    const days = Math.round((sec / 86400) * 10) / 10
    return [String(days), days === 1 ? 'day' : 'days']
  }

  private getActivityIcon(type: string): string {
    switch (type) {
      case 'created':
        return 'plus-circle'
      case 'assigned':
        return 'user-check'
      case 'status_changed':
        return 'refresh-cw'
      case 'comment':
      case 'commented':
        return 'message-circle'
      case 'attachment':
        return 'paperclip'
      case 'sla_breach':
        return 'alert-triangle'
      default:
        return 'activity'
    }
  }

  private getActivityColor(type: string): string {
    switch (type) {
      case 'created':
        return 'green'
      case 'assigned':
        return 'blue'
      case 'status_changed':
        return 'yellow'
      case 'comment':
      case 'commented':
        return 'purple'
      case 'attachment':
        return 'gray'
      case 'sla_breach':
        return 'red'
      default:
        return 'gray'
    }
  }

  async metrics(tokenHolder?: any) {
    const userFilter = this.getUserFilter(tokenHolder)
    const whereSql = this.buildRoleWhereSql(tokenHolder)

    // Find closed status for accurate status filtering
    const closedStatus = await Status.findOne({
      where: { slug: { [Op.like]: '%closed%' } },
    }).catch(() => null)

    // 1. KPI Counters
    const total_tickets = await Ticket.count({ where: userFilter }).catch(() => 0)

    const closedConditions: any[] = [{ close: { [Op.ne]: null } }]
    if (closedStatus) {
      closedConditions.push({ status_id: closedStatus.id })
    }
    const closed_tickets = await Ticket.count({
      where: {
        ...userFilter,
        [Op.or]: closedConditions,
      },
    }).catch(() => 0)

    const openWhere: any = {
      ...userFilter,
      close: null,
    }
    if (closedStatus) {
      openWhere.status_id = { [Op.ne]: closedStatus.id }
    }
    const opened_tickets = await Ticket.count({ where: openWhere }).catch(() => 0)

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const new_tickets = await Ticket.count({
      where: {
        ...userFilter,
        created_at: { [Op.gte]: startOfToday },
      },
    }).catch(() => 0)

    const un_assigned_tickets = await Ticket.count({
      where: {
        ...userFilter,
        assigned_to: null,
        close: null,
      },
    }).catch(() => 0)

    // 2. Quick Stats Counters
    const customerRole = await Role.findOne({ where: { slug: 'customer' } }).catch(() => null)
    const total_customer = await User.count({
      where: customerRole ? { role_id: customerRole.id } : { role_id: 2 },
    }).catch(() => 0)

    const total_contacts = await Contact.count().catch(() => 0)

    // 3. Response Times
    let first_response: string[] = ['0', 'minutes']
    let last_response: string[] = ['0', 'hours']
    try {
      const respWhere = whereSql
        ? `${whereSql} AND response IS NOT NULL`
        : 'WHERE response IS NOT NULL'
      const minMaxRows: any[] = await getSequelize().query(
        `SELECT MIN(TIMESTAMPDIFF(SECOND, created_at, response)) as minSec, MAX(TIMESTAMPDIFF(SECOND, created_at, response)) as maxSec FROM tickets ${respWhere}`,
        { type: QueryTypes.SELECT }
      )
      if (minMaxRows.length && minMaxRows[0].minSec != null) {
        first_response = this.formatDuration(Number(minMaxRows[0].minSec))
      }
      if (minMaxRows.length && minMaxRows[0].maxSec != null) {
        last_response = this.formatDuration(Number(minMaxRows[0].maxSec))
      }
    } catch {
      // ignore
    }

    // 4. Analytics Overview Distributions
    let top_departments: any[] = []
    try {
      const deptRows: any[] = await Ticket.findAll({
        attributes: ['department_id', [fn('COUNT', col('Ticket.id')), 'total']],
        where: userFilter,
        group: ['department_id'],
        order: [[literal('total'), 'DESC']],
        limit: 5,
        include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
      })
      const totalDeptTickets =
        deptRows.reduce((acc, r) => acc + Number(r.getDataValue('total') || 0), 0) || 1
      top_departments = deptRows.map((r, idx) => {
        const count = Number(r.getDataValue('total') || 0)
        const dept = r.department
        const name = dept?.name || 'General Support'
        const percent = Math.round((count / totalDeptTickets) * 100)
        const color = PALETTE[idx % PALETTE.length]
        return { name, count, color, percent }
      })
    } catch {
      top_departments = []
    }

    let top_types: any[] = []
    try {
      const typeRows: any[] = await Ticket.findAll({
        attributes: ['type_id', [fn('COUNT', col('Ticket.id')), 'total']],
        where: userFilter,
        group: ['type_id'],
        order: [[literal('total'), 'DESC']],
        limit: 5,
        include: [{ model: Type, as: 'type', attributes: ['id', 'name'] }],
      })
      const totalTypeTickets =
        typeRows.reduce((acc, r) => acc + Number(r.getDataValue('total') || 0), 0) || 1
      top_types = typeRows.map((r, idx) => {
        const count = Number(r.getDataValue('total') || 0)
        const typeObj = r.type
        const name = typeObj?.name || 'Standard'
        const percent = Math.round((count / totalTypeTickets) * 100)
        const color = PALETTE[(idx + 2) % PALETTE.length]
        return { name, count, color, percent }
      })
    } catch {
      top_types = []
    }

    let top_creators: any[] = []
    try {
      const creatorRows: any[] = await Ticket.findAll({
        attributes: ['user_id', [fn('COUNT', col('Ticket.id')), 'total']],
        where: {
          ...userFilter,
          user_id: { [Op.ne]: null },
        },
        group: ['user_id'],
        order: [[literal('total'), 'DESC']],
        limit: 5,
        include: [
          { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'name'] },
        ],
      })
      const totalCreatorTickets =
        creatorRows.reduce((acc, r) => acc + Number(r.getDataValue('total') || 0), 0) || 1
      top_creators = creatorRows.map((r, idx) => {
        const count = Number(r.getDataValue('total') || 0)
        const u = r.user
        const name = u
          ? `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.name || `User #${u.id}`
          : 'Customer'
        const percent = Math.round((count / totalCreatorTickets) * 100)
        const color = PALETTE[(idx + 4) % PALETTE.length]
        return { name, count, color, percent }
      })
    } catch {
      top_creators = []
    }

    // 5. 12-Month Ticket History Chart
    const now = new Date()
    const previousMonths: string[] = []
    const monthsMap: Record<string, number> = {}

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mName = MONTH_NAMES[d.getMonth()]
      previousMonths.push(mName)
      monthsMap[mName] = 0
    }

    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0)
    let m_total = 0
    try {
      const recent12MonthTickets = await Ticket.findAll({
        attributes: ['created_at'],
        where: {
          ...userFilter,
          created_at: { [Op.gte]: twelveMonthsAgo },
        },
        raw: true,
      })
      for (const t of recent12MonthTickets) {
        if (t.created_at) {
          const d = new Date(t.created_at)
          const mName = MONTH_NAMES[d.getMonth()]
          if (monthsMap[mName] !== undefined) {
            monthsMap[mName]++
            m_total++
          }
        }
      }
    } catch {
      // ignore
    }

    const this_month = monthsMap[previousMonths[0]] || 0
    const last_month = monthsMap[previousMonths[1]] || 0

    const chart_line = {
      months: monthsMap,
      previousMonths,
      total: m_total,
      this_month,
      last_month,
    }

    // 6. SLA Metrics
    const nowTime = new Date()
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const breached_tickets = await Ticket.count({
      where: {
        ...userFilter,
        close: null,
        due: { [Op.lt]: nowTime, [Op.ne]: null },
      },
    }).catch(() => 0)

    const at_risk_tickets = await Ticket.count({
      where: {
        ...userFilter,
        close: null,
        due: { [Op.gt]: nowTime, [Op.lte]: in24Hours },
      },
    }).catch(() => 0)

    const total_with_sla = await Ticket.count({
      where: {
        ...userFilter,
        due: { [Op.ne]: null },
      },
    }).catch(() => 0)

    const compliance_rate =
      total_with_sla > 0
        ? Number((((total_with_sla - breached_tickets) / total_with_sla) * 100).toFixed(1))
        : 100

    let avg_resolution_time = 0
    try {
      const closeWhere = whereSql ? `${whereSql} AND close IS NOT NULL` : 'WHERE close IS NOT NULL'
      const avgRows: any[] = await getSequelize().query(
        `SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, close)) as avgHours FROM tickets ${closeWhere}`,
        { type: QueryTypes.SELECT }
      )
      if (avgRows.length && avgRows[0].avgHours != null) {
        avg_resolution_time = Number(Number(avgRows[0].avgHours).toFixed(1))
      }
    } catch {
      // ignore
    }

    const sla_metrics = {
      compliance_rate,
      breached_tickets,
      at_risk_tickets,
      avg_resolution_time,
      total_with_sla,
    }

    // 7. Conversation Metrics
    let convWhere: any = {}
    let convInclude: any[] = []
    if (userFilter.assigned_to) {
      convWhere = { '$ticket.assigned_to$': userFilter.assigned_to }
      convInclude = [{ model: Ticket, as: 'ticket', attributes: [] }]
    } else if (userFilter[Op.or]) {
      convWhere = {
        [Op.or]: [
          { contact_id: tokenHolder.id },
          { '$ticket.user_id$': tokenHolder.id },
        ],
      }
      convInclude = [{ model: Ticket, as: 'ticket', attributes: [] }]
    }

    const total_conversations = await Conversation.count({
      where: convWhere,
      include: convInclude,
    }).catch(() => 0)

    const active_conversations = await Conversation.count({
      where: { ...convWhere, status: 'active' },
      include: convInclude,
    }).catch(() => 0)

    const today_conversations = await Conversation.count({
      where: { ...convWhere, created_at: { [Op.gte]: startOfToday } },
      include: convInclude,
    }).catch(() => 0)

    const total_messages = await Message.count().catch(() => 0)
    const avg_messages_per_conversation =
      total_conversations > 0 ? Number((total_messages / total_conversations).toFixed(1)) : 0

    const conversation_metrics = {
      total_conversations,
      active_conversations,
      today_conversations,
      avg_messages_per_conversation,
    }

    // 8. Recent Activities Stream
    let recent_activities: any[] = []
    try {
      const activities = await TicketActivity.findAll({
        limit: 10,
        order: [
          ['created_at', 'DESC'],
          ['id', 'DESC'],
        ],
        include: [
          {
            model: Ticket,
            as: 'ticket',
            attributes: ['id', 'uid', 'subject'],
            where: Object.keys(userFilter).length ? userFilter : undefined,
            required: Object.keys(userFilter).length ? true : false,
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'name'],
          },
        ],
      })

      recent_activities = activities.map((act: any) => {
        const u = act.user
        const userDisplay = u
          ? `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.name || `User #${u.id}`
          : 'System'
        const ticketUid = act.ticket?.uid || act.ticket?.id || act.ticket_id
        return {
          id: act.id,
          type: act.activity_type,
          icon: this.getActivityIcon(act.activity_type),
          color: this.getActivityColor(act.activity_type),
          description: act.description || `Ticket #${ticketUid} activity`,
          user: userDisplay,
          ticket_uid: ticketUid,
          created_at: act.created_at || new Date().toISOString(),
        }
      })
    } catch {
      recent_activities = []
    }

    // Fallback if no activity logs yet
    if (!recent_activities.length) {
      try {
        const recentTickets = await Ticket.findAll({
          where: userFilter,
          limit: 10,
          order: [['id', 'DESC']],
          include: [
            { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'name'] },
          ],
        })
        recent_activities = recentTickets.map((t: any) => {
          const u = t.user
          const userDisplay = u
            ? `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.name || `User #${u.id}`
            : 'System User'
          const isClosed = !!t.close
          return {
            id: t.id,
            type: isClosed ? 'closed' : 'created',
            icon: isClosed ? 'check-circle' : 'plus-circle',
            color: isClosed ? 'green' : 'blue',
            description: t.subject || `Ticket #${t.uid || t.id} created`,
            user: userDisplay,
            ticket_uid: t.uid || t.id,
            created_at: t.created_at || new Date().toISOString(),
          }
        })
      } catch {
        recent_activities = []
      }
    }

    // 9. Status Breakdown
    let byStatus: any[] = []
    try {
      const statusRows: any[] = await getSequelize().query(
        `SELECT status_id, COUNT(id) as count FROM tickets ${whereSql} GROUP BY status_id`,
        { type: QueryTypes.SELECT }
      )
      const allStatuses = await Status.findAll({ attributes: ['id', 'name', 'slug'] })
      const statusMap = new Map(allStatuses.map((s) => [s.id, s]))

      byStatus = statusRows.map((r, idx) => {
        const st = statusMap.get(r.status_id)
        return {
          status_id: r.status_id,
          name: st?.name || `Status #${r.status_id}`,
          count: Number(r.count),
          color: PALETTE[idx % PALETTE.length],
        }
      })
    } catch {
      byStatus = []
    }

    return {
      // Frontend dashboard component properties
      total_tickets,
      opened_tickets,
      closed_tickets,
      closed_status_id: closedStatus?.id || null,
      new_tickets,
      un_assigned_tickets,
      total_customer,
      total_contacts,
      first_response,
      last_response,
      top_departments,
      top_types,
      top_creators,
      chart_line,
      sla_metrics,
      conversation_metrics,
      recent_activities,

      // Aliases for backwards compatibility
      total: total_tickets,
      open: opened_tickets,
      closed: closed_tickets,
      customers: total_customer,
      contacts: total_contacts,
      byStatus,
      recent: recent_activities,
      message: 'Dashboard metrics fetched successfully',
    }
  }

  async analytics(tokenHolder?: any) {
    const userFilter = this.getUserFilter(tokenHolder)
    const whereSql = this.buildRoleWhereSql(tokenHolder)
    const metrics = await this.metrics(tokenHolder)

    let statusBreakdown: any[] = []
    try {
      const statusRows: any[] = await getSequelize().query(
        `SELECT status_id, COUNT(id) as count FROM tickets ${whereSql} GROUP BY status_id`,
        { type: QueryTypes.SELECT }
      )
      const allStatuses = await Status.findAll({ attributes: ['id', 'name', 'slug'] })
      const statusMap = new Map(allStatuses.map((s) => [s.id, s]))

      statusBreakdown = statusRows.map((r, idx) => {
        const st = statusMap.get(r.status_id)
        return {
          status_id: r.status_id,
          count: Number(r.count),
          status: {
            id: r.status_id,
            name: st?.name || `Status #${r.status_id}`,
            slug: st?.slug || '',
            color: PALETTE[idx % PALETTE.length],
          },
        }
      })
    } catch {
      statusBreakdown = []
    }

    let impact_levels: Record<string, number> = {}
    try {
      const impactWhere = whereSql
        ? `${whereSql} AND impact_level IS NOT NULL`
        : 'WHERE impact_level IS NOT NULL'
      const impactRows: any[] = await getSequelize().query(
        `SELECT impact_level, COUNT(id) as count FROM tickets ${impactWhere} GROUP BY impact_level`,
        { type: QueryTypes.SELECT }
      )
      impactRows.forEach((r) => {
        if (r.impact_level) impact_levels[r.impact_level] = Number(r.count)
      })
    } catch {
      impact_levels = {}
    }

    let urgency_levels: Record<string, number> = {}
    try {
      const urgencyWhere = whereSql
        ? `${whereSql} AND urgency_level IS NOT NULL`
        : 'WHERE urgency_level IS NOT NULL'
      const urgencyRows: any[] = await getSequelize().query(
        `SELECT urgency_level, COUNT(id) as count FROM tickets ${urgencyWhere} GROUP BY urgency_level`,
        { type: QueryTypes.SELECT }
      )
      urgencyRows.forEach((r) => {
        if (r.urgency_level) urgency_levels[r.urgency_level] = Number(r.count)
      })
    } catch {
      urgency_levels = {}
    }

    const overdue_tickets = await Ticket.count({
      where: {
        ...userFilter,
        close: null,
        due: { [Op.lt]: new Date(), [Op.ne]: null },
      },
    }).catch(() => 0)

    return {
      ticketsCreated: metrics.total_tickets,
      ticketsOpen: metrics.opened_tickets,
      ticketsClosed: metrics.closed_tickets,
      statusBreakdown,
      impact_levels,
      urgency_levels,
      overdue_tickets,
      top_departments: metrics.top_departments,
      top_types: metrics.top_types,
      top_creators: metrics.top_creators,
      message: 'Dashboard analytics fetched successfully',
    }
  }

  async performance(tokenHolder?: any) {
    const metrics = await this.metrics(tokenHolder)
    const userFilter = this.getUserFilter(tokenHolder)

    const total = metrics.total_tickets
    const withFirstResponse = await Ticket.count({
      where: {
        ...userFilter,
        response: { [Op.ne]: null },
      },
    }).catch(() => 0)

    return {
      total,
      firstResponseRate: total ? Number(((withFirstResponse / total) * 100).toFixed(1)) : 0,
      resolveRate: total ? Number(((metrics.closed_tickets / total) * 100).toFixed(1)) : 0,
      first_response: metrics.first_response,
      last_response: metrics.last_response,
      sla_metrics: metrics.sla_metrics,
      message: 'Dashboard performance fetched successfully',
    }
  }

  async charts(tokenHolder?: any) {
    const whereSql = this.buildRoleWhereSql(tokenHolder)
    const metrics = await this.metrics(tokenHolder)

    let byStatus: any[] = []
    let byPriority: any[] = []
    try {
      const statusRows: any[] = await getSequelize().query(
        `SELECT status_id, COUNT(id) as count FROM tickets ${whereSql} GROUP BY status_id`,
        { type: QueryTypes.SELECT }
      )
      const allStatuses = await Status.findAll({ attributes: ['id', 'name', 'slug'] })
      const statusMap = new Map(allStatuses.map((s) => [s.id, s]))

      byStatus = statusRows.map((r, idx) => {
        const st = statusMap.get(r.status_id)
        return {
          status_id: r.status_id,
          name: st?.name || `Status #${r.status_id}`,
          count: Number(r.count),
          color: PALETTE[idx % PALETTE.length],
        }
      })

      const priorityRows: any[] = await getSequelize().query(
        `SELECT priority_id, COUNT(id) as count FROM tickets ${whereSql} GROUP BY priority_id`,
        { type: QueryTypes.SELECT }
      )
      const allPriorities = await Priority.findAll({ attributes: ['id', 'name'] })
      const priorityMap = new Map(allPriorities.map((p) => [p.id, p]))

      byPriority = priorityRows.map((r, idx) => {
        const pr = priorityMap.get(r.priority_id)
        return {
          priority_id: r.priority_id,
          name: pr?.name || `Priority #${r.priority_id}`,
          count: Number(r.count),
          color: PALETTE[(idx + 2) % PALETTE.length],
        }
      })
    } catch {
      byStatus = []
      byPriority = []
    }

    return {
      statusChart: byStatus,
      priorityChart: byPriority,
      byStatus,
      byPriority,
      chart_line: metrics.chart_line,
      message: 'Dashboard charts fetched successfully',
    }
  }
}
