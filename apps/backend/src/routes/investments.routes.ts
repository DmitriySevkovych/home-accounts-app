import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'

import { RepositoryLocator } from '../db/repositoryLocator'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()
    const httpLogger = getHttpLogger('backend')

    router.get('/', async (req, res) => {
        httpLogger(req, res)
        const data = {
            investments: await repository.getInvestments(),
        }
        res.status(200).json(data)
    })

    return router
}

export default getRouter
