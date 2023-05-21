import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'
import { RepositoryLocator } from '../db/repositoryLocator'

const getRouter = async (): Promise<Router> => {
    const router = express.Router()
    const repository = await RepositoryLocator.getRepository()
    const httpLogger = getHttpLogger('backend')

    router.get('/transactionCategories', async (req, res) => {
        httpLogger(req, res)
        const data = await repository.getTransactionCategories()
        res.status(200).json(data)
    })

    router.get('/taxCategories', async (req, res) => {
        httpLogger(req, res)
        const data = await repository.getTaxCategories()
        res.status(200).json(data)
    })

    router.get('/paymentMethods', async (req, res) => {
        httpLogger(req, res)
        const data = await repository.getPaymentMethods()
        res.status(200).json(data)
    })

    router.get('/bankAccounts', async (req, res) => {
        httpLogger(req, res)
        const data = await repository.getBankAccounts()
        res.status(200).json(data)
    })

    return router
}

export default getRouter
