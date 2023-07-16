import { json, urlencoded } from 'body-parser'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import https from 'https'
import path from 'path'
import { readFileSync } from 'fs'

import mountRoutes from './routes'

export const createServer = async (): Promise<Express> => {
    const app = express()
    app.disable('x-powered-by')
        .use(morgan('dev'))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cors())
        .get('/healthz', (req, res) => {
            return res.json({ ok: true })
        })

    mountRoutes(app)

    return app
}

export const createSecureServer = async (): Promise<https.Server> => {
    const app = await createServer()

    return https.createServer(
        {
            key: readFileSync(
                process.env['TLS_KEY'] ||
                    path.join(__dirname, 'cert', 'key.pem')
            ),
            cert: readFileSync(
                process.env['TLS_CERT'] ||
                    path.join(__dirname, 'cert', 'cert.pem')
            ),
        },
        app
    )
}
