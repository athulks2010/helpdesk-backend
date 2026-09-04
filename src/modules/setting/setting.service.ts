import { SettingRepository } from './setting.repository'
import fs from 'fs'
import path from 'path'
import { getEnvPath } from '../../core/env/env.service'
import { Exception } from '../../core'

const repo = new SettingRepository()

function updateEnvFile(updates: Record<string, string>) {
  const relativeEnvPath = getEnvPath()
  const candidatePaths = [
    path.resolve(process.cwd(), relativeEnvPath),
    path.resolve(process.cwd(), '.env'),
  ]

  for (const targetPath of candidatePaths) {
    let content = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, 'utf8') : ''

    for (const [key, val] of Object.entries(updates)) {
      if (!key) continue
      const envKey = key.toUpperCase()
      const strVal = val !== undefined && val !== null ? String(val) : ''
      process.env[envKey] = strVal

      const formattedVal = strVal.includes(' ') || strVal.includes('@') ? `"${strVal.replace(/"/g, '\\"')}"` : strVal
      const regex = new RegExp(`^${envKey}=.*$`, 'm')
      if (regex.test(content)) {
        content = content.replace(regex, `${envKey}=${formattedVal}`)
      } else {
        content = content.trimEnd() + `\n${envKey}=${formattedVal}\n`
      }
    }

    const dir = path.dirname(targetPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(targetPath, content, 'utf8')
  }
}

export class SettingService {
  findAll(query: any) {
    return repo.findAll(query)
  }

  findById(id: number | string) {
    return repo.findById(id)
  }

  async findBySlug(slug: string) {
    if (!slug) {
      throw new Exception({ message: 'Slug is required', httpResponseCode: 400 })
    }

    try {
      const item = await repo.findBySlug(slug)
      if (item) return item
    } catch {
      // If not in database, fallback to checking environment variables
    }

    const envMap: Record<string, string | undefined> = {
      mail_host: process.env.MAIL_HOST,
      mail_port: process.env.MAIL_PORT,
      mail_username: process.env.MAIL_USERNAME,
      mail_password: process.env.MAIL_PASSWORD,
      mail_encryption: process.env.MAIL_ENCRYPTION,
      mail_from_address: process.env.MAIL_FROM_ADDRESS,
      mail_from_name: process.env.MAIL_FROM_NAME,
      pusher_app_id: process.env.PUSHER_APP_ID,
      pusher_app_key: process.env.PUSHER_APP_KEY,
      pusher_app_secret: process.env.PUSHER_APP_SECRET,
      pusher_app_cluster: process.env.PUSHER_APP_CLUSTER,
      enable_email_piping: process.env.IMAP_ENABLED,
      imap_enabled: process.env.IMAP_ENABLED,
      imap_host: process.env.IMAP_HOST,
      imap_port: process.env.IMAP_PORT,
      imap_protocol: process.env.IMAP_PROTOCOL,
      imap_encryption: process.env.IMAP_ENCRYPTION,
      imap_username: process.env.IMAP_USERNAME,
      imap_password: process.env.IMAP_PASSWORD,
    }

    if (envMap[slug] !== undefined) {
      return {
        slug,
        value: envMap[slug],
      }
    }

    const upperKey = slug.toUpperCase()
    if (process.env[upperKey] !== undefined) {
      return {
        slug,
        value: process.env[upperKey],
      }
    }

    throw new Exception({ message: 'Setting not found', httpResponseCode: 404 })
  }

  create(body: any) {
    return repo.create(body)
  }

  async update(body: any) {
    if (body && body.id) {
      return repo.update(body)
    }
    const items = this.parseBodyToItems(body)
    if (items.length > 0) {
      const updated = await repo.upsertBySlugs(items)
      return { items: updated, message: 'Settings updated successfully' }
    }
    return repo.update(body)
  }

  private parseBodyToItems(body: any): { slug: string; value: any }[] {
    if (Array.isArray(body)) {
      return body
    } else if (body && Array.isArray(body.settings)) {
      return body.settings
    } else if (body && typeof body.settings === 'object' && body.settings !== null) {
      return Object.entries(body.settings).map(([slug, value]) => ({ slug, value }))
    } else if (body && typeof body === 'object') {
      return Object.entries(body).map(([slug, value]) => ({ slug, value }))
    }
    return []
  }

  // SMTP Settings
  async getSmtpSettings() {
    return {
      mail_host: process.env.MAIL_HOST || '',
      mail_port: process.env.MAIL_PORT || '587',
      mail_username: process.env.MAIL_USERNAME || '',
      mail_password: process.env.MAIL_PASSWORD || '',
      mail_encryption: process.env.MAIL_ENCRYPTION || 'tls',
      mail_from_address: process.env.MAIL_FROM_ADDRESS || '',
      mail_from_name: process.env.MAIL_FROM_NAME || 'HelpDesk',
    }
  }

  async updateSmtpSettings(body: any) {
    const items = this.parseBodyToItems(body)
    const envUpdates: Record<string, string> = {}
    const mapKeyToEnv: Record<string, string> = {
      mail_host: 'MAIL_HOST',
      mail_port: 'MAIL_PORT',
      mail_username: 'MAIL_USERNAME',
      mail_password: 'MAIL_PASSWORD',
      mail_encryption: 'MAIL_ENCRYPTION',
      mail_from_address: 'MAIL_FROM_ADDRESS',
      mail_from_name: 'MAIL_FROM_NAME',
    }

    for (const item of items) {
      if (mapKeyToEnv[item.slug]) {
        envUpdates[mapKeyToEnv[item.slug]] = String(item.value || '')
      }
    }

    updateEnvFile(envUpdates)

    return { item: await this.getSmtpSettings(), message: 'SMTP settings updated successfully' }
  }

  // Pusher Settings
  async getPusherSettings() {
    return {
      pusher_app_id: process.env.PUSHER_APP_ID || '',
      pusher_app_key: process.env.PUSHER_APP_KEY || '',
      pusher_app_secret: process.env.PUSHER_APP_SECRET || '',
      pusher_app_cluster: process.env.PUSHER_APP_CLUSTER || 'mt1',
    }
  }

  async updatePusherSettings(body: any) {
    const items = this.parseBodyToItems(body)
    const envUpdates: Record<string, string> = {}
    const mapKeyToEnv: Record<string, string> = {
      pusher_app_id: 'PUSHER_APP_ID',
      pusher_app_key: 'PUSHER_APP_KEY',
      pusher_app_secret: 'PUSHER_APP_SECRET',
      pusher_app_cluster: 'PUSHER_APP_CLUSTER',
    }

    for (const item of items) {
      if (mapKeyToEnv[item.slug]) {
        envUpdates[mapKeyToEnv[item.slug]] = String(item.value || '')
      }
    }

    updateEnvFile(envUpdates)

    return { item: await this.getPusherSettings(), message: 'Pusher settings updated successfully' }
  }

  // Email Piping Settings
  async getPipingSettings() {
    return {
      enable_email_piping: process.env.IMAP_ENABLED || 'false',
      imap_host: process.env.IMAP_HOST || '',
      imap_port: process.env.IMAP_PORT || '993',
      imap_protocol: process.env.IMAP_PROTOCOL || 'imap',
      imap_encryption: process.env.IMAP_ENCRYPTION || 'ssl',
      imap_username: process.env.IMAP_USERNAME || '',
      imap_password: process.env.IMAP_PASSWORD || '',
    }
  }

  async updatePipingSettings(body: any) {
    const items = this.parseBodyToItems(body)
    const envUpdates: Record<string, string> = {}
    const mapKeyToEnv: Record<string, string> = {
      enable_email_piping: 'IMAP_ENABLED',
      imap_enabled: 'IMAP_ENABLED',
      imap_host: 'IMAP_HOST',
      imap_port: 'IMAP_PORT',
      imap_protocol: 'IMAP_PROTOCOL',
      imap_encryption: 'IMAP_ENCRYPTION',
      imap_username: 'IMAP_USERNAME',
      imap_password: 'IMAP_PASSWORD',
    }

    for (const item of items) {
      if (mapKeyToEnv[item.slug]) {
        envUpdates[mapKeyToEnv[item.slug]] = String(item.value || '')
      }
    }

    updateEnvFile(envUpdates)

    return { item: await this.getPipingSettings(), message: 'Email piping settings updated successfully' }
  }

  destroy(id: number | string) {
    return repo.destroy(id)
  }

  restore(id: number | string) {
    return repo.restore(id)
  }
}
