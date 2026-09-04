import express from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import { getEnvPath } from './env/env.service'

const rfs = require('rotating-file-stream')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const fs = require('fs')

;(() => {
  const relativeEnvPath = getEnvPath()
  const candidates: string[] = []
  if (relativeEnvPath) {
    candidates.push(
      path.resolve(process.cwd(), relativeEnvPath),
      path.resolve(__dirname, `../../${relativeEnvPath}`)
    )
  }
  let loaded = false
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const res = dotenv.config({ path: candidate })
      dotenvExpand.expand(res)
      loaded = true
      break
    }
  }
  if (!loaded) {
    const defaultEnv = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(defaultEnv)) {
      const res = dotenv.config({ path: defaultEnv })
      dotenvExpand.expand(res)
    }
  }
})()

export const app = express()

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.indexOf('*') !== -1 ||
      !origin
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

const logDirectory = path.join(__dirname, 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory, { recursive: true })
const accessLogStream = rfs.createStream(
  () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}-access.log`
  },
  { interval: '1d', path: logDirectory }
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '25mb' }))
app.use(cors(corsOptions))
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('combined'))
app.use('/files', express.static(path.resolve(process.cwd(), 'public/files')))
app.use('/images', express.static(path.resolve(process.cwd(), 'public/images')))
