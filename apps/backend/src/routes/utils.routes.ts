import express, { type Router } from 'express'

import { RepositoryLocator } from '../db/repositoryLocator'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.get('/transactionCategories', async (req, res) => {
        const data = await repository.getTransactionCategories()
        res.status(200).json(data)
    })

    router.get('/taxCategories', async (req, res) => {
        const data = await repository.getTaxCategories()
        res.status(200).json(data)
    })

    router.get('/paymentMethods', async (req, res) => {
        const data = await repository.getPaymentMethods()
        res.status(200).json(data)
    })

    router.get('/bankAccounts', async (req, res) => {
        const data = await repository.getBankAccounts()
        res.status(200).json(data)
    })

    router.get('/tags', async (req, res) => {
        const data = await repository.getTags()
        res.status(200).json(data)
    })

    router.get('/constants/transactions', async (req, res) => {
        const data = {
            transactionCategories: await repository.getTransactionCategories(),
            taxCategories: await repository.getTaxCategories(),
            paymentMethods: await repository.getPaymentMethods(),
            bankAccounts: await repository.getBankAccounts(),
            tags: await repository.getTags(),
        }
        res.status(200).json(data)
    })

    return router
}

export default getRouter
