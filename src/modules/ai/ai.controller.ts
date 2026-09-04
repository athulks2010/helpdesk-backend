import { AiService } from './ai.service'

export class AiController {
  private service = new AiService()

  classify(body: any) {
    return this.service.classify(body)
  }

  suggestions(body: any) {
    return this.service.suggestions(body)
  }

  sentiment(body: any) {
    return this.service.sentiment(body)
  }

  status() {
    return this.service.status()
  }

  analytics() {
    return this.service.analytics()
  }

  settings(body: any) {
    return this.service.settings(body)
  }
}
