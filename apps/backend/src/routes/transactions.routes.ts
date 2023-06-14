import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'
import { RepositoryLocator } from '../db/repositoryLocator'
import {
    Transaction,
    TransactionValidationError,
    deserializeTransaction,
} from 'domain-model'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()
    const httpLogger = getHttpLogger('backend')

    router.post('/', async (req, res) => {
        httpLogger(req, res)

        try {
            const transaction: Transaction = deserializeTransaction(req.body)
            const id = await repository.createTransaction(transaction)
            res.status(201).json({
                message: `Created new entry with id: ${id}`,
            })
        } catch (err) {
            req.log.error(err)
            if (err instanceof TransactionValidationError) {
                res.status(400).json({
                    message:
                        'Data sent in the request body is not a valid transaction',
                })
            } else {
                res.status(500).json({ message: 'Something went wrong' })
            }
        }
    })

    return router
}

export default getRouter
