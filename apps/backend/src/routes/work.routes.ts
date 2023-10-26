import express, { type Router } from 'express'

import { RepositoryLocator } from '../db/repositoryLocator'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.get('/invoices', async (req, res) => {
        const data = {
            invoices: await repository.getProjectInvoices(),
        }
        res.status(200).json(data)
    })

    return router
}

export default getRouter
