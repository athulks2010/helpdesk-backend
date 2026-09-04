import { NavigationMenuRepository } from './navigation-menu.repository'

const repo = new NavigationMenuRepository()

export class NavigationMenuService {
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

  async reorder(body: any) {
    let items: any[] = []
    if (Array.isArray(body)) {
      items = body
    } else if (body && Array.isArray(body.items)) {
      items = body.items
    } else if (body && Array.isArray(body.orders)) {
      items = body.orders
    } else if (body && Array.isArray(body.menus)) {
      items = body.menus
    }

    const updates: { id: number; sort_order: number }[] = []

    for (let i = 0; i < items.length; i++) {
      const entry = items[i]
      let id: number | null = null
      let sortOrder: number = i + 1

      if (typeof entry === 'number' || typeof entry === 'string') {
        id = Number(entry)
      } else if (entry && typeof entry === 'object') {
        id = entry.id !== undefined ? Number(entry.id) : null
        if (entry.sort_order !== undefined) {
          sortOrder = Number(entry.sort_order)
        } else if (entry.order !== undefined) {
          sortOrder = Number(entry.order)
        }
      }

      if (id) {
        updates.push({ id, sort_order: sortOrder })
      }
    }

    return repo.reorder(updates)
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }
}
