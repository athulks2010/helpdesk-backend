import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import { Exception } from '../../core'
import { User } from './user.model'
import { PendingUser } from './pending-user.model'

const SAFE_EXCLUDE = ['password', 'remember_token']

export class UserRepository {
  async findAll(query: any = {}) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 20
    const offset = (pageNumber - 1) * pageSize
    const where: any = {}

    if (query.role_id) where.role_id = query.role_id
    if (query.searchText) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${query.searchText}%` } },
        { last_name: { [Op.like]: `%${query.searchText}%` } },
        { email: { [Op.like]: `%${query.searchText}%` } },
      ]
    }

    const sortField = query.sortField || 'id'
    const sortOrder = (query.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: SAFE_EXCLUDE },
      include: [{ association: 'role' }],
      limit: pageSize,
      offset,
      order: [[sortField, sortOrder]],
    })

    return { items: rows, totalCount: count, message: 'Users fetched successfully' }
  }

  async findById(id: number | string) {
    const user = await User.findByPk(id, { attributes: { exclude: SAFE_EXCLUDE } })
    if (!user) throw new Exception({ message: 'User not found', httpResponseCode: 404 })
    return user
  }

  async findByEmail(email: string, includeRole = false) {
    const options: any = { where: { email } }
    if (includeRole) {
      options.include = [{ association: 'role' }]
    }
    const user = await User.findOne(options)
    return user
  }

  async create(body: any) {
    const payload = { ...body }
    if (!payload.name) {
      payload.name = `${payload.first_name || ''} ${payload.last_name || ''}`.trim() || 'User'
    }
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10)
    }
    const user = await User.create(payload)
    const json: any = user.toJSON()
    delete json.password
    delete json.remember_token
    return json
  }

  async update(body: any) {
    const id = body.id
    if (!id) throw new Exception({ message: 'id is required', httpResponseCode: 422 })
    const user = await User.findByPk(id)
    if (!user) throw new Exception({ message: 'User not found', httpResponseCode: 404 })
    const payload = { ...body }
    delete payload.id
    if (payload.first_name || payload.last_name) {
      if (!payload.name) {
        payload.name = `${payload.first_name || user.first_name || ''} ${payload.last_name || user.last_name || ''}`.trim()
      }
    }
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10)
    } else {
      delete payload.password
    }
    await user.update(payload)
    const json: any = user.toJSON()
    delete json.password
    delete json.remember_token
    return json
  }

  async destroy(id: number | string) {
    const user = await User.findByPk(id)
    if (!user) throw new Exception({ message: 'User not found', httpResponseCode: 404 })
    await user.destroy()
    const json: any = user.toJSON()
    delete json.password
    return json
  }

  async restore(id: number | string) {
    const user = await User.findByPk(id, { paranoid: false })
    if (!user) throw new Exception({ message: 'User not found', httpResponseCode: 404 })
    await user.restore()
    const json: any = user.toJSON()
    delete json.password
    return json
  }

  async findPending(query: any = {}) {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const pageSize = parseInt(query.pageSize, 10) || 20
    const offset = (pageNumber - 1) * pageSize
    const { rows, count } = await PendingUser.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit: pageSize,
      offset,
      order: [['id', 'DESC']],
    })
    return { items: rows, totalCount: count, message: 'Pending users fetched successfully' }
  }

  async approvePending(id: number | string) {
    const pending = await PendingUser.findByPk(id)
    if (!pending) throw new Exception({ message: 'Pending user not found', httpResponseCode: 404 })
    const user = await User.create({
      first_name: pending.first_name,
      last_name: pending.last_name,
      email: pending.email,
      password: pending.password,
      role_id: pending.role_id,
    })
    await pending.destroy()
    const json: any = user.toJSON()
    delete json.password
    return json
  }

  async declinePending(id: number | string) {
    const pending = await PendingUser.findByPk(id)
    if (!pending) throw new Exception({ message: 'Pending user not found', httpResponseCode: 404 })
    await pending.destroy()
    return { id, message: 'Pending user declined' }
  }
}
