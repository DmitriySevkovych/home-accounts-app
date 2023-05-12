import { json, urlencoded } from 'body-parser'
import { Transaction, createTransaction } from 'domain-model'
import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'

import getUtilsRouter from './utils'

export const createServer = (): Express => {
    const app = express()
    app.disable('x-powered-by')
        .use(morgan('dev'))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cors())
        .use('/api/v1/utils', getUtilsRouter())
        .get('/transactions/:origin', (req, res) => {
            return res.json(tempCreateDummyTransaction(req.params.origin))
        })
        .get('/healthz', (req, res) => {
            return res.json({ ok: true })
        })

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
