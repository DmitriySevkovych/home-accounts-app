import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'
import { RepositoryLocator } from '../db/repositoryLocator'
import {
    Transaction,
    TransactionValidationError,
    deserializeTransaction,
} from 'domain-model'
import { BadQueryParameterInRequestError } from '../helpers/errors'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()
    const httpLogger = getHttpLogger('backend')

    router.get('/', async (req, res) => {
        httpLogger(req, res)

        try {
            const transactions = await repository.getTransactions()
            return res.status(200).json(transactions)
        } catch (err) {
            req.log.error(err)
            if (err instanceof BadQueryParameterInRequestError) {
                res.status(400).json({
                    message: err.message,
                })
            } else {
                res.status(500).json({ message: 'Something went wrong' })
            }
        }
    })

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
