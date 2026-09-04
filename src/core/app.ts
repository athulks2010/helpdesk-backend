import 'reflect-metadata'
import express from 'express'
import basicAuth from 'express-basic-auth'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { log } from 'console'
import { send } from './app.util'
import listEndpoints from 'express-list-endpoints'
import { Env } from './env/env.interface'
import { Exception } from './error/error.service'
import { swaggerOptions } from './swagger/swagger.config'

const port = process.env.PORT || 3000

export const applicationBootstrap = async (
  expressApp: express.Express,
  options: { DISABLE_HTTP_SERVER?: boolean } = {}
) => {
  // DB + models are initialized in src/index.ts before routes are mounted

  if (!options.DISABLE_HTTP_SERVER) {
    const server = expressApp.listen(port, () => {
      log(`HelpDesk API started on http://localhost:${port}`)
      if (
        process.env.NODE_ENV === Env.LOCAL ||
        process.env.NODE_ENV === Env.DEVELOPMENT ||
        process.env.NODE_ENV === Env.SANDBOX
      ) {
        log(`Swagger docs: http://localhost:${port}/api/docs`)
      }
    })
    server.setTimeout(300000)
  }

  expressApp.use((err: any, req: any, res: any, next: any) => {
    err = new Exception(err, err.detailedException)
    if (!err.message) err.message = 'Bad Request'
    if (!err.httpResponseCode) err.httpResponseCode = 400
    send(
      res,
      {},
      {
        httpResponseCode: err.httpResponseCode,
        detailedException: err.detailedException,
        message: err.message,
      },
      err.httpResponseCode
    )
  })

  if (
    process.env.NODE_ENV === Env.LOCAL ||
    process.env.NODE_ENV === Env.DEVELOPMENT ||
    process.env.NODE_ENV === Env.SANDBOX
  ) {
    const swaggerDocs = swaggerJsdoc(swaggerOptions)
    expressApp.use(
      '/api/docs',
      basicAuth({
        users: {
          [process.env.SWAGGER_USER || 'admin']: process.env.SWAGGER_PASSWORD || 'admin',
        },
        challenge: true,
        unauthorizedResponse: () => 'Unauthorized',
      }),
      swaggerUi.serveFiles(swaggerDocs, {
        swaggerOptions: {
          persistAuthorization: true,
          tagsSorter: 'alpha',
          operationsSorter: 'alpha',
        },
      }),
      swaggerUi.setup(swaggerDocs, {
        swaggerOptions: {
          persistAuthorization: true,
          tagsSorter: 'alpha',
          operationsSorter: 'alpha',
        },
      })
    )

    expressApp.get('/routes', (req, res, next) => {
      try {
        const response: any = listEndpoints(expressApp)
        response.message = 'Route fetch successful'
        send(res, response)
      } catch (error) {
        next(error)
      }
    })
  }

  expressApp.all('*', (req, res) => {
    send(res, {}, { detailedException: [], message: 'Page not found' }, 404)
  })
}
