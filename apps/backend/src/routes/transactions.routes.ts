import {
    TransactionValidationError,
    deserializeTransaction,
} from 'domain-model'
import express, { type Router } from 'express'
import stream from 'stream'

import { RepositoryLocator } from '../db/repositoryLocator'
import {
    BadQueryParameterInRequestError,
    NoRecordFoundInDatabaseError,
} from '../helpers/errors'
import { checkIdIsInteger } from '../helpers/middleware'
import { getPaginationOptionsFromRequest } from '../helpers/pagination'
import upload, { deserializeTransactionReceipt } from '../helpers/upload'

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.get('/', async (req, res) => {
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

    router.get('/:id', checkIdIsInteger, async (req, res) => {
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

    router.get('/:id/receipt', checkIdIsInteger, async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const transaction = await repository.getTransactionById(id)

            if (!transaction.receiptId) {
                return res.status(404).send({
                    message: `The transaction with id=${id} does not have an associated receipt.`,
                })
            }

            const receipt = await repository.getTransactionReceipt(
                transaction.receiptId
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
    })

    return router
}

export default getRouter
