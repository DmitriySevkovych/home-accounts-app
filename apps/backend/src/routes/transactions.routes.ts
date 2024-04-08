import {
    TransactionValidationError,
    deserializeTransaction,
} from 'domain-model'
import express, { type Response, type Router } from 'express'
import stream from 'stream'

import { RepositoryLocator } from '../db/repositoryLocator'
import {
    GetTransactionSearchRequest,
    GetTransactionsRequest,
} from '../definitions/requests'
import {
    BadQueryParameterInRequestError,
    NoRecordFoundInDatabaseError,
    UnsupportedTransactionOperationError,
} from '../helpers/errors'
import * as middleware from '../helpers/middleware'
import upload, { deserializeTransactionReceipt } from '../helpers/upload'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.get(
        '/',
        [middleware.transactionContext, middleware.pagination],
        async (req: GetTransactionsRequest, res: Response) => {
            try {
                /* 
                REM: transactionContext and paginationOptions cannot be undefined! This is ensured by the middleware.
                However, to be able to extend the Request interface and comply with the expected middleware types, these fields
                had to be marked as optional in ../definitions/requests.ts.
             */
                const { transactionContext, paginationOptions } = req

                const transactions = await repository.getTransactions(
                    transactionContext!,
                    paginationOptions!
                )
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
        }
    )

    router.post('/', upload.single('receipt'), async (req, res) => {
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

    router.get('/origins', async (req, res) => {
        try {
            const transactionOrigins = await repository.getTransactionOrigins()
            return res.status(200).json({ transactionOrigins })
        } catch (err) {
            req.log.error(err)
            res.status(500).json({ message: 'Something went wrong' })
        }
    })

    router.get(
        '/receipt/:receiptId',
        middleware.checkIdIsInteger,
        async (req, res) => {
            const receiptId = parseInt(req.params.receiptId)
            try {
                const receipt = await repository.getTransactionReceipt(
                    receiptId
                )

                res.status(200)
                res.set(
                    'Content-disposition',
                    `attachment; filename=${receipt.name}`
                )
                res.set('Content-Type', receipt.mimetype)

                /**
                 * Pass the in-memory buffer through a readStream so that it can be downloaded as a file,
                 * cf. {@see ../../docs/api.md#sending-files-in-responses}.
                 *
                 * The straightforward approach res.download() does not work (the download-method expects a path to a file on disk).
                 *
                 * Using res.send(receipt.buffer) does technically work and would probably be simpler. Not sure though if there are any gotchas.
                 * I'll leave the stream.PassThrough implementation for now.
                 */
                const readStream = new stream.PassThrough()
                readStream.end(receipt.buffer)
                readStream.pipe(res)
            } catch (err) {
                req.log.error(err)
                if (err instanceof NoRecordFoundInDatabaseError) {
                    res.status(404).json({
                        message: 'No record found in the database.',
                        cause: err.message,
                    })
                } else {
                    res.status(500).json({ message: 'Something went wrong' })
                }
            }
        }
    )

    router.get('/:id', middleware.checkIdIsInteger, async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const transaction = await repository.getTransactionById(id)
            return res.status(200).json(transaction)
        } catch (err) {
            req.log.error(err)
            if (err instanceof NoRecordFoundInDatabaseError) {
                res.status(404).json({
                    message: 'No record found in the database.',
                    cause: err.message,
                })
            } else {
                res.status(500).json({ message: 'Something went wrong' })
            }
        }
    })

    router.delete('/:id', middleware.checkIdIsInteger, async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            await repository.deleteTransaction(id)
            return res.sendStatus(204)
        } catch (err) {
            req.log.error(err)
            if (err instanceof UnsupportedTransactionOperationError) {
                res.status(400).json({
                    message: err.message,
                })
            } else if (err instanceof NoRecordFoundInDatabaseError) {
                res.status(404).json({
                    message: 'No record found in the database.',
                    cause: err.message,
                })
            } else {
                res.status(500).json({ message: 'Something went wrong' })
            }
        }
    })

    router.put('/', upload.single('receipt'), async (req, res) => {
        try {
            // Deserialize payload
            const transaction = deserializeTransaction(
                JSON.parse(req.body.transaction)
            )
            const receipt = deserializeTransactionReceipt(req.file)

            // Little sanity check
            if (!transaction.id) {
                return res.status(400).json({
                    message:
                        'The sent transaction does not have an id. Can not update.',
                })
            }

            // Update
            await repository.updateTransaction(transaction, receipt)
            return res.status(200).json({ message: 'Transaction updated' })
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

    router.post(
        '/search',
        middleware.pagination,
        async (req: GetTransactionSearchRequest, res) => {
            try {
                const { parameters } = req.body
                const transactions = await repository.searchTransactions(
                    parameters,
                    req.paginationOptions!
                )
                return res.status(200).json({ transactions })
            } catch (err) {
                req.log.error(err)
                res.status(500).json({ message: 'Something went wrong' })
            }
        }
    )

    return router
}

export default getRouter
