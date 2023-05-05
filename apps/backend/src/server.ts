import bodyParser from 'body-parser'
import express from 'express'
// import morgan from "morgan";
import cors from 'cors'

export const createServer = () => {
    const { json, urlencoded } = bodyParser
    const app = express()
    app.disable('x-powered-by')
        // .use(morgan("dev"))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cors())

    const router = express.Router()
    router.get('/message/:name', (req, res) => {
        return res.json({ message: `hello ${req.params.name}` })
    })
    router.get('/healthz', (req, res) => {
        return res.json({ ok: true })
    })

    app.use('/api/v1', router)

    return app
}
