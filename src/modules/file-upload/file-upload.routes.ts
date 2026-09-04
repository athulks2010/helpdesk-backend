import multer from 'multer'
import { FileUploadController } from './file-upload.controller'
import { FileUploadService } from './file-upload.service'
import { Router } from '../../core'

const fileUploadService = new FileUploadService()
const uploadDir = fileUploadService.getUploadDir()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safe}`)
  },
})

const upload = multer({ storage })

const fileUploadController = new FileUploadController()

export const fileUploadWithMiddleware = new Router()
fileUploadWithMiddleware.post(
  '/upload',
  async (req) => fileUploadController.upload(req),
  [upload.single('file')] as any
)
fileUploadWithMiddleware.get('/list', async () => fileUploadController.list())
