import multer from 'multer'
import { ServiceController } from './service.controller'
import { FileUploadService } from '../file-upload/file-upload.service'
import { Router } from '../../core'

const controller = new ServiceController()
const uploadDir = new FileUploadService().getUploadDir()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safe}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
})

const imageUpload = [upload.any()] as any

export const serviceWithMiddleware = new Router()
serviceWithMiddleware.get('/all', async (req) => controller.all(req.query))
serviceWithMiddleware.get('/single', async (req) => controller.single(req.query))
serviceWithMiddleware.post('/create', async (req) => controller.create(req), imageUpload)
serviceWithMiddleware.put('/update', async (req) => controller.update(req), imageUpload)
serviceWithMiddleware.post('/update', async (req) => controller.update(req), imageUpload)
serviceWithMiddleware.delete('/delete', async (req) => controller.delete(req.query))
serviceWithMiddleware.post('/restore', async (req) => controller.restore(req.body))
