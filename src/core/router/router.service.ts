import express, { Request } from 'express'
import { send } from '../app.util'

type RequestTypes = 'get' | 'post' | 'put' | 'delete'

export class Router {
  router: express.Router

  constructor() {
    this.router = express.Router()
  }

  get(route: string, callback: (obj: Request) => any, middleware: any[] = []) {
    return this.route(route, 'get', callback, middleware)
  }

  post(route: string, callback: (obj: Request) => any, middleware: any[] = []) {
    return this.route(route, 'post', callback, middleware)
  }

  put(route: string, callback: (obj: Request) => any, middleware: any[] = []) {
    return this.route(route, 'put', callback, middleware)
  }

  delete(route: string, callback: (obj: Request) => any, middleware: any[] = []) {
    return this.route(route, 'delete', callback, middleware)
  }

  private route(
    route: string,
    method: RequestTypes,
    callback: (obj: Request) => any,
    middleware: any[] = []
  ) {
    this.router[method](route, ...middleware, async (req: Request, res, next) => {
      try {
        const response = await callback(req)
        if (res.headersSent) return
        if (response?.redirect) {
          res.send(`<script>window.location.href="${response.url}";</script>`)
        } else {
          send(res, response)
        }
      } catch (error) {
        next(error)
      }
    })
    return this
  }
}
