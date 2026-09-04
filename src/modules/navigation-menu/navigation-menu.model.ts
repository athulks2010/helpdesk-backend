import { DataTypes, Model } from 'sequelize'
import { getSequelize } from '../../core/db/db.connection'

export class NavigationMenu extends Model {
  declare id: number
  declare location?: string
  declare label?: string
  declare route_name?: string
  declare route_params?: any
  declare url?: string
  declare icon?: string
  declare active_key?: string
  declare feature_slug?: string
  declare target?: string
  declare sort_order?: number
  declare is_active?: boolean

  // Aliases for compatibility
  get name() {
    return this.getDataValue('label')
  }
  set name(val: any) {
    this.setDataValue('label', val)
  }

  get order() {
    return this.getDataValue('sort_order')
  }
  set order(val: any) {
    this.setDataValue('sort_order', val)
  }

  toJSON() {
    const values: any = super.toJSON()
    values.name = this.getDataValue('label')
    values.order = this.getDataValue('sort_order')
    return values
  }
}

export const initNavigationMenuModel = () => {
  NavigationMenu.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      location: { type: DataTypes.STRING(32), defaultValue: 'header' },
      label: { type: DataTypes.STRING(255), allowNull: false },
      route_name: DataTypes.STRING(255),
      route_params: DataTypes.JSON,
      url: DataTypes.STRING(255),
      icon: DataTypes.STRING(255),
      active_key: DataTypes.STRING(255),
      feature_slug: DataTypes.STRING(255),
      target: { type: DataTypes.STRING(16), defaultValue: '_self' },
      sort_order: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize: getSequelize(),
      tableName: 'navigation_menus',
      freezeTableName: true,
    }
  )
  return NavigationMenu
}
