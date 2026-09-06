import nodemailer from 'nodemailer'

export class MailService {
  private transporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: process.env.MAIL_ENCRYPTION === 'ssl',
      auth:
        process.env.MAIL_USERNAME
          ? {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            }
          : undefined,
    })
  }

  async send(to: string, subject: string, html: string) {
    if (!process.env.MAIL_HOST) {
      console.log('[mail:skip]', { to, subject })
      return { skipped: true }
    }
    return this.transporter().sendMail({
      from: `"${process.env.MAIL_FROM_NAME || 'HelpDesk'}" <${
        process.env.MAIL_FROM_ADDRESS || 'noreply@helpdesk.local'
      }>`,
      to,
      subject,
      html,
    })
  }
  async sendTemplate(slug: string, to: string, data: Record<string, any> = {}) {
    if (!process.env.MAIL_HOST) return { skipped: true }
    try {
      const { EmailTemplate } = require('../modules/email-template/email-template.model')
      const template = await EmailTemplate.findOne({ where: { slug } })
      const html = template?.html || template?.body
      if (!template || !html) {
        console.error(`[mail:template] Template not found or empty: ${slug}`)
        return { skipped: true, reason: `Template not found: ${slug}` }
      }
      const replacements: Record<string, any> = {
        url: process.env.APP_URL || '',
        sender_name: process.env.MAIL_FROM_NAME || process.env.APP_NAME || 'HelpDesk',
        app_name: process.env.APP_NAME || 'HelpDesk',
        ...data,
      }
      if (!replacements.name && (data.first_name || data.last_name)) {
        replacements.name = `${data.first_name || ''} ${data.last_name || ''}`.trim()
      }
      let body = html
      for (const [key, val] of Object.entries(replacements)) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const value = String(val ?? '')
        body = body.replace(new RegExp(`\\{\\{${escaped}\\}\\}`, 'g'), value)
        body = body.replace(new RegExp(`\\{${escaped}\\}`, 'g'), value)
      }
      return await this.send(to, template.name || template.subject || 'Notification', body)
    } catch (err) {
      console.error(`[mail:template] Failed to send template ${slug}`, err)
    }
    return { skipped: true, reason: 'Template not found or error' }
  }
}
export const mailService = new MailService()
