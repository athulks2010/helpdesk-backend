import { NoteController } from './note.controller'
import { Router } from '../../core'

const controller = new NoteController()

export const noteWithMiddleware = new Router()
noteWithMiddleware.get('/all', async (req) => controller.all(req.query))
noteWithMiddleware.get('/single', async (req) => controller.single(req.query))
noteWithMiddleware.post('/create', async (req) => controller.create(req.body))
noteWithMiddleware.put('/update', async (req) => controller.update(req.body))
noteWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
noteWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
