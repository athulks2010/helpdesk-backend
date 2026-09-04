import { FileUploadService } from './file-upload.service'

export class FileUploadController {
  private service = new FileUploadService()

  upload(req: any) {
    return this.service.upload(req.file, req.body)
  }

  list() {
    return this.service.list()
  }
}
