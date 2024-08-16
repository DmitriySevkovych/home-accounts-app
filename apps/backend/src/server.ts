import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import express, { type Express } from 'express'
import { readFileSync } from 'fs'
import https from 'https'
import morgan from 'morgan'
import path from 'path'

import { checkAuthHeader } from './helpers/middleware'
import mountRoutes from './routes'

export const createServer = async (): Promise<Express> => {
    const app = express()
    app.disable('x-powered-by')
        .use(morgan('dev'))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cors())
        .use(checkAuthHeader)

    mountRoutes(app)

    return app
}

export const createSecureServer = async (): Promise<https.Server> => {
    const app = await createServer()

    return https.createServer(
        {
            key: readFileSync(
                process.env.TLS_KEY || path.join(__dirname, 'cert', 'key.pem')
            ),
            cert: readFileSync(
                process.env.TLS_CERT || path.join(__dirname, 'cert', 'cert.pem')
            ),
        },
        app
    )
}
