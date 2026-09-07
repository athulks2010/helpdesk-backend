import { DashboardService } from './dashboard.service'

export class DashboardController {
  private service = new DashboardService()

  metrics(tokenHolder?: any) {
    return this.service.metrics(tokenHolder)
  }

  analytics(tokenHolder?: any) {
    return this.service.analytics(tokenHolder)
  }

  performance(tokenHolder?: any) {
    return this.service.performance(tokenHolder)
  }

  charts(tokenHolder?: any) {
    return this.service.charts(tokenHolder)
  }
}
