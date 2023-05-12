import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'

//TODO: #8: load data from a DB
const temporarilyHardcodedTaxCategories = [
    'EINKOMMENSTEUER',
    'VERMIETUNG_UND_VERPACHTUNG',
    'WERBUNGSKOSTEN',
    'AUSSERORDENTLICHE_BELASTUNGEN',
]

const temporarilyHardcodedTransactionCategories = [
    'FOOD',
    'HOUSEHOLD',
    'TRANSPORTATION',
    'BEAUTY',
    'LEISURE',
    'VACATION',
]

const temporarilyHardcodedPaymentMethods = [
    'EC',
    'TRANSFER',
    'PAYPAL',
    'CASH',
    'DIRECT_DEBIT',
    'SEPA',
]

const temporarilyHardcodedBankAccounts = [
    'KSKWN',
    'CoBa Premium',
    'CoBa Business',
    'VoBa Invest',
    'CASH',
]

const getRouter = (): Router => {
    const router = express.Router()
    const httpLogger = getHttpLogger('backend')

    router.get('/transactionCategories', (req, res) => {
        httpLogger(req, res)
        res.status(200).json(temporarilyHardcodedTransactionCategories)
    })

    router.get('/taxCategories', (req, res) => {
        httpLogger(req, res)
        res.status(200).json(temporarilyHardcodedTaxCategories)
    })

    router.get('/paymentMethods', (req, res) => {
        httpLogger(req, res)
        res.status(200).json(temporarilyHardcodedPaymentMethods)
    })

    router.get('/bankAccounts', (req, res) => {
        httpLogger(req, res)
        res.status(200).json(temporarilyHardcodedBankAccounts)
    })

    return router
}

export default getRouter
