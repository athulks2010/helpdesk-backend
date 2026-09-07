import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'files')

const ensureUploadDir = (dir: string = UPLOAD_DIR) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export class FileUploadService {
  async upload(file: Express.Multer.File | undefined, body: any = {}) {
    if (!file) {
      return { message: 'No file uploaded', item: null }
    }
    let folder = body.folder;
    if (folder) {
      // Sanitize folder name to prevent directory traversal
      folder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    }
    if (!folder) folder = 'files';

    let finalPath = `/files/${file.filename}`;
    let absolutePath = file.path;

    if (folder !== 'files') {
      const targetDir = path.resolve(process.cwd(), 'public', 'files', folder);
      ensureUploadDir(targetDir);
      
      const newFilePath = path.join(targetDir, file.filename);
      fs.renameSync(file.path, newFilePath);
      absolutePath = newFilePath;
      
      finalPath = `/files/${folder}/${file.filename}`;
    }

    const isSaved = fs.existsSync(absolutePath);

    return {
      item: {
        name: file.originalname,
        filename: file.filename,
        path: finalPath,
        mime: file.mimetype,
        size: file.size,
        folder,
        isSaved,
      },
      message: 'File uploaded successfully',
    }
  }

  saveBuffer(buffer: Buffer, folder: string, filename: string) {
    folder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'files'
    const targetDir = path.resolve(process.cwd(), 'public', 'files', folder)
    ensureUploadDir(targetDir)
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    fs.writeFileSync(path.join(targetDir, safe), buffer)
    return `/files/${folder}/${safe}`
  }

  deletePublicPath(publicPath?: string | null) {
    if (!publicPath || typeof publicPath !== 'string') return
    const relative = publicPath.replace(/^\/+/, '')
    if (!relative.startsWith('files/')) return
    const full = path.resolve(process.cwd(), 'public', relative)
    const root = path.resolve(process.cwd(), 'public', 'files')
    if (!full.startsWith(root)) return
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      fs.unlinkSync(full)
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
