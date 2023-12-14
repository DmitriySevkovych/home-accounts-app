import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import express, { type Express } from 'express'
import morgan from 'morgan'

import { backendHttpLogger, checkAuthHeader } from './helpers/middleware'
import mountRoutes from './routes'

export const createServer = async (): Promise<Express> => {
    const app = express()
    app.disable('x-powered-by')
        .use(morgan('dev'))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cors())
        .use(backendHttpLogger)
        .use(checkAuthHeader)
        .get('/healthz', (req, res) => {
            return res.json({ ok: true })
        })

    mountRoutes(app)

    return app
}
