import 'reflect-metadata'
import { app, applicationBootstrap } from './core'
import { dbConnection } from './core/db/db.connection'
import { initAllModels } from './modules/models.init'
import { authenticationMiddleware } from './index.middleware'
import { authorizePusherChannel } from './utils/pusher'
import { startCronJobs } from './index.cron'

import { auth, authWithMiddleware } from './modules/auth/auth.routes'
import { ticketWithMiddleware } from './modules/ticket/ticket.routes'
import { ticketFieldWithMiddleware } from './modules/ticket-field/ticket-field.routes'
import { conversationWithMiddleware } from './modules/conversation/conversation.routes'
import { userWithMiddleware } from './modules/user/user.routes'
import { roleWithMiddleware } from './modules/role/role.routes'
import { contactWithMiddleware } from './modules/contact/contact.routes'
import { organizationWithMiddleware } from './modules/organization/organization.routes'
import { categoryWithMiddleware } from './modules/category/category.routes'
import { priorityWithMiddleware } from './modules/priority/priority.routes'
import { statusWithMiddleware } from './modules/status/status.routes'
import { departmentWithMiddleware } from './modules/department/department.routes'
import { typeWithMiddleware } from './modules/type/type.routes'
import { faqWithMiddleware } from './modules/faq/faq.routes'
import { noteWithMiddleware } from './modules/note/note.routes'
import { setting, settingWithMiddleware } from './modules/setting/setting.routes'
import { language, languageWithMiddleware } from './modules/language/language.routes'
import { emailTemplateWithMiddleware } from './modules/email-template/email-template.routes'
import { navigationMenu, navigationMenuWithMiddleware } from './modules/navigation-menu/navigation-menu.routes'
import { frontPageWithMiddleware } from './modules/front-page/front-page.routes'
import { serviceWithMiddleware } from './modules/service/service.routes'
import { knowledgeBaseWithMiddleware } from './modules/knowledge-base/knowledge-base.routes'
import { postWithMiddleware } from './modules/post/post.routes'
import { dashboardWithMiddleware } from './modules/dashboard/dashboard.routes'
import { reportWithMiddleware } from './modules/report/report.routes'
import { aiWithMiddleware } from './modules/ai/ai.routes'
import { fileUploadWithMiddleware } from './modules/file-upload/file-upload.routes'
import { notificationWithMiddleware } from './modules/notification/notification.routes'
import { publicRouter } from './modules/public/public.routes'
import { country, countryWithMiddleware } from './modules/country/country.routes'

const bootstrap = async () => {
  // Load env via side-effect of app import, then connect DB + models before routes
  await dbConnection()
  await initAllModels()

  // Public auth (Laravel /api/v1/auth/*)
  app.use('/auth', auth.router)
  app.use('/auth', authenticationMiddleware, authWithMiddleware.router)

  // Public CMS / open-ticket / newsletter
  app.use('/public', publicRouter.router)

  // Pusher private channel auth (Laravel POST /broadcasting/auth)
  app.post('/broadcasting/auth', authenticationMiddleware, (req, res) => {
    const socketId = req.body.socket_id
    const channelName = req.body.channel_name
    const auth = authorizePusherChannel(socketId, channelName)
    res.json(auth)
  })

  // Protected domain modules (GeoHaul-style paths)
  app.use('/ticket', authenticationMiddleware, ticketWithMiddleware.router)
  app.use('/ticket-field', authenticationMiddleware, ticketFieldWithMiddleware.router)
  app.use('/conversation', authenticationMiddleware, conversationWithMiddleware.router)
  app.use('/user', authenticationMiddleware, userWithMiddleware.router)
  app.use('/role', authenticationMiddleware, roleWithMiddleware.router)
  app.use('/contact', authenticationMiddleware, contactWithMiddleware.router)
  app.use('/organization', authenticationMiddleware, organizationWithMiddleware.router)
  app.use('/category', authenticationMiddleware, categoryWithMiddleware.router)
  app.use('/priority', authenticationMiddleware, priorityWithMiddleware.router)
  app.use('/status', authenticationMiddleware, statusWithMiddleware.router)
  app.use('/department', authenticationMiddleware, departmentWithMiddleware.router)
  app.use('/type', authenticationMiddleware, typeWithMiddleware.router)
  app.use('/faq', authenticationMiddleware, faqWithMiddleware.router)
  app.use('/note', authenticationMiddleware, noteWithMiddleware.router)
  app.use('/setting', setting.router)
  app.use('/setting', authenticationMiddleware, settingWithMiddleware.router)
  app.use('/language', language.router)
  app.use('/language', authenticationMiddleware, languageWithMiddleware.router)
  app.use('/country', country.router)
  app.use('/country', authenticationMiddleware, countryWithMiddleware.router)
  app.use('/email-template', authenticationMiddleware, emailTemplateWithMiddleware.router)
  app.use('/navigation-menu', navigationMenu.router)
  app.use('/navigation-menu', authenticationMiddleware, navigationMenuWithMiddleware.router)
  app.use('/front-page', authenticationMiddleware, frontPageWithMiddleware.router)
  app.use('/service', authenticationMiddleware, serviceWithMiddleware.router)
  app.use('/knowledge-base', authenticationMiddleware, knowledgeBaseWithMiddleware.router)
  app.use('/post', authenticationMiddleware, postWithMiddleware.router)
  app.use('/dashboard', authenticationMiddleware, dashboardWithMiddleware.router)
  app.use('/report', authenticationMiddleware, reportWithMiddleware.router)
  app.use('/ai', authenticationMiddleware, aiWithMiddleware.router)
  app.use('/file-upload', authenticationMiddleware, fileUploadWithMiddleware.router)
  app.use('/notification', authenticationMiddleware, notificationWithMiddleware.router)

  // Cron HTTP triggers (Laravel /cron/*)
  app.get('/cron/piping', async (req, res, next) => {
    try {
      const { runEmailPiping } = await import('./index.cron')
      const result = await runEmailPiping()
      res.json({ response: { status: 'SUCCESS', message: 'OK' }, data: result })
    } catch (e) {
      next(e)
    }
  })

  startCronJobs()

  await applicationBootstrap(app, { DISABLE_HTTP_SERVER: false })
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
