import express, { type Router } from 'express'

import { RepositoryLocator } from '../db/repositoryLocator'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.get('/', async (req, res) => {
        const data = {
            investments: await repository.getInvestments(),
        }
        res.status(200).json(data)
    })

    return router
}

export default getRouter
