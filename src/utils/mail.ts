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
      // Lazy load to avoid circular dependencies if needed
      const { EmailTemplate } = require('../modules/email-template/email-template.model')
      const template = await EmailTemplate.findOne({ where: { slug } })
      if (template && template.body) {
        let body = template.body
        for (const [key, val] of Object.entries(data)) {
          body = body.replace(new RegExp(`{{${key}}}`, 'g'), String(val || ''))
        }
        return await this.send(to, template.subject || 'Notification', body)
      }
    } catch (err) {
      console.error(`[mail:template] Failed to send template ${slug}`, err)
    }
    return { skipped: true, reason: 'Template not found or error' }
  }
}
export const mailService = new MailService()
