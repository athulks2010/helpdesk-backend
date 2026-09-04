import { DashboardService } from './dashboard.service'

export class DashboardController {
  private service = new DashboardService()

  metrics() {
    return this.service.metrics()
  }

  analytics() {
    return this.service.analytics()
  }

  performance() {
    return this.service.performance()
  }

  charts() {
    return this.service.charts()
  }
}
