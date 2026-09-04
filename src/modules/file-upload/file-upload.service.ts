import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'files')

const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

export class FileUploadService {
  async upload(file: Express.Multer.File | undefined, body: any = {}) {
    if (!file) {
      return { message: 'No file uploaded', item: null }
    }
    return {
      item: {
        name: file.originalname,
        filename: file.filename,
        path: `/files/${file.filename}`,
        mime: file.mimetype,
        size: file.size,
        folder: body.folder || 'files',
      },
      message: 'File uploaded successfully',
    }
  }

  async list() {
    ensureUploadDir()
    const files = fs.readdirSync(UPLOAD_DIR).map((name) => {
      const full = path.join(UPLOAD_DIR, name)
      const stat = fs.statSync(full)
      return {
        name,
        path: `/files/${name}`,
        size: stat.size,
        modifiedAt: stat.mtime,
      }
    })
    return { items: files, totalCount: files.length, message: 'Files listed successfully' }
  }

  getUploadDir() {
    ensureUploadDir()
    return UPLOAD_DIR
  }
}
