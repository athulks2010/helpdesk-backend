import { Options } from 'swagger-jsdoc'

const apiPort = process.env.PORT || 3000
const appName = process.env.APP_NAME || 'HelpDesk API'
const apiVersion = process.env.API_VERSION || '1.0.0'

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${appName}`,
      version: `${apiVersion}`,
      description: `${appName} - Express TypeScript HelpDesk API`,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        description: 'Local Server',
        url: `http://localhost:${apiPort}`,
      },
      {
        description: 'Sandbox Server',
        url: process.env.SWAGGER_SANDBOX_URL || 'https://sb.api.helpdesk.local',
      },
      {
        description: 'Production Server',
        url: process.env.SWAGGER_PRODUCTION_URL || 'https://api.helpdesk.local',
      },
    ],
  },
  apis: ['./src/modules/*/*.docs.ts', './dist/modules/*/*.docs.js'],
}

export { swaggerOptions }
