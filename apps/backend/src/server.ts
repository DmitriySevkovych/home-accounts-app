import { json, urlencoded } from 'body-parser'
import { Transaction, createTransaction } from 'domain-model/transactions'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'

import mountRoutes from './routes'

export const createServer = async (): Promise<Express> => {
    const app = express()
    app.disable('x-powered-by')
        .use(morgan('dev'))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cors())
        .get('/transactions/:origin', (req, res) => {
            return res.json(tempCreateDummyTransaction(req.params.origin))
        })
        .get('/healthz', (req, res) => {
            return res.json({ ok: true })
        })

    await mountRoutes(app)

    return app
}

const tempCreateDummyTransaction = (origin: string): Transaction => {
    const transaction: Transaction = createTransaction()
        .about('FOOD', origin, 'This is a dummy transaction')
        .withAmount(123)
        .withCurrency('DummyMoney', 999)
        .withPaymentFrom('TRANSFER', 'DummyBank')
        .withAgent('Dummy Agent')
        .addTags(['Test', 'Tag'])
        .build()
    return transaction
}
