import { Op } from 'sequelize'
import { Exception } from '../../core'
import { Role } from './role.model'

export class RoleRepository {
  async findAll(query: any = {}) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 20
    const offset = (pageNumber - 1) * pageSize
    const where: any = {}

    if (query.searchText) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.searchText}%` } },
        { slug: { [Op.like]: `%${query.searchText}%` } },
      ]
    }

    const sortField = query.sortField || 'id'
    const sortOrder = (query.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const { rows, count } = await Role.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [[sortField, sortOrder]],
    })

    return { items: rows, totalCount: count, message: 'Roles fetched successfully' }
  }

  async findById(id: number | string) {
    const role = await Role.findByPk(id)
    if (!role) throw new Exception({ message: 'Role not found', httpResponseCode: 404 })
    return role
  }

  async create(body: any) {
    const payload = { ...body }
    if (typeof payload.access === 'string') {
      try {
        payload.access = JSON.parse(payload.access)
      } catch {
        // keep as is
      }
    }
    return Role.create(payload)
  }

  async update(body: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })
    const role = await this.findById(id)
    const payload = { ...body }
    if (typeof payload.access === 'string') {
      try {
        payload.access = JSON.parse(payload.access)
      } catch {
        // keep as is
      }
    }
    await role.update(payload)
    return role
  }

  async destroy(id: number | string) {
    const role = await this.findById(id)
    await role.destroy()
    return role
  }

  async restore(id: number | string) {
    const role = await Role.findByPk(id, { paranoid: false })
    if (!role) throw new Exception({ message: 'Role not found', httpResponseCode: 404 })
    await role.restore()
    return role
  }
}
