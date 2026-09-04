import { ReportService } from './report.service'

export class ReportController {
  private service = new ReportService()

  generate(body: any) {
    return this.service.generate(body)
  }

  show(query: any) {
    return this.service.show(query)
  }
}
