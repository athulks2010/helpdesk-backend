import { Router } from '../../core'
import { PublicController } from './public.controller'

import { optionalAuthMiddleware, authenticationMiddleware } from '../../index.middleware'

/** Public landing / open-ticket / chat init (no auth) */
export const publicRouter = new Router()
const ctrl = new PublicController()

publicRouter.get('/faqs', (req) => ctrl.getFaqs(req))
publicRouter.get('/posts', (req) => ctrl.getPosts(req))
publicRouter.get('/posts/single', (req) => ctrl.getSinglePost(req))
publicRouter.get('/knowledge-base', (req) => ctrl.getKnowledgeBase(req))
publicRouter.get('/services', (req) => ctrl.getServices(req))
publicRouter.get('/front-page', (req) => ctrl.getFrontPage(req))
publicRouter.post('/ticket/open', (req) => ctrl.openTicket(req), [optionalAuthMiddleware])
publicRouter.post('/subscribe/news', (req) => ctrl.subscribeNews(req))
publicRouter.post('/contact', (req) => ctrl.addContact(req))
publicRouter.post('/chat/init', (req) => ctrl.initChat(req))
publicRouter.get('/chat/conversation', (req) => ctrl.getConversation(req))
publicRouter.post('/chat/send-message', (req) => ctrl.sendChatMessage(req))

publicRouter.get('/departments', (req) => ctrl.getDepartments(req))
publicRouter.get('/categories', (req) => ctrl.getCategories(req))
publicRouter.get('/priorities', (req) => ctrl.getPriorities(req))
publicRouter.get('/types', (req) => ctrl.getTypes(req))

