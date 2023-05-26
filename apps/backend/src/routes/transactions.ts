import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'
import { RepositoryLocator } from '../db/repositoryLocator'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()
    const httpLogger = getHttpLogger('backend')

    router.post('/', async (req, res) => {
        httpLogger(req, res)
        const created = repository.createTransaction(req.body)
        res.status(200).json({ message: `Created: ${created}` })
    })

    return router
}

export default getRouter
