import { CountryController } from './country.controller'
import { Router } from '../../core'

const controller = new CountryController()

export const country = new Router()
country.get('/all', async (req) => controller.all(req.query))
country.get('/single', async (req) => controller.single(req.query))

export const countryWithMiddleware = new Router()
countryWithMiddleware.get('/all', async (req) => controller.all(req.query))
countryWithMiddleware.get('/single', async (req) => controller.single(req.query))
