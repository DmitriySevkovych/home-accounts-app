import {
    TransactionValidationError,
    deserializeTransaction,
} from 'domain-model'
import express, { type Router } from 'express'
import { getHttpLogger } from 'logger'

import { RepositoryLocator } from '../db/repositoryLocator'
import {
    BadQueryParameterInRequestError,
    NoRecordFoundInDatabaseError,
} from '../helpers/errors'
import { getPaginationOptionsFromRequest } from '../helpers/pagination'
import upload, { deserializeTransactionReceipt } from '../helpers/upload'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()
    const httpLogger = getHttpLogger('backend')

    router.get('/', async (req, res) => {
        httpLogger(req, res)

        try {
            const paginationOptions = getPaginationOptionsFromRequest(req)
            const transactions =
                await repository.getTransactions(paginationOptions)
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

    router.post('/', upload.single('receipt'), async (req, res) => {
        httpLogger(req, res)

        try {
            // Deserialize payload
            const transaction = deserializeTransaction(
                JSON.parse(req.body.transaction)
            )
            const receipt = deserializeTransactionReceipt(req.file)
            // Persist
            const id = await repository.createTransaction(transaction, receipt)
            // Send response
            res.status(201).json({
                message: `Created new entry with id: ${id}`,
            })
        } catch (err) {
            req.log.error(err)
            if (err instanceof TransactionValidationError) {
                res.status(400).json({
                    message:
                        'Data sent in the request body is not a valid transaction.',
                    cause: err.message,
                })
            } else {
                res.status(500).json({ message: 'Something went wrong' })
            }
        }
    })

    router.get('/:id', async (req, res) => {
        httpLogger(req, res)

        const id = parseInt(req.params.id)

        if (isNaN(id)) {
            const message = `The request contains a malformed id in path (id=${id}).`
            req.log.error({ message })
            res.status(400).json({ message })
            return
        }

        try {
            const transaction = await repository.getTransactionById(id)
            return res.status(200).json(transaction)
        } catch (err) {
            req.log.error(err)
            if (err instanceof NoRecordFoundInDatabaseError) {
                res.status(404).json({
                    message: err.message,
                })
            } else {
                res.status(500).json({ message: 'Something went wrong' })
            }
        }
    })

    return router
}

export default getRouter
