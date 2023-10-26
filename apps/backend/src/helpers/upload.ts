import { TransactionReceipt } from 'domain-model'
import { Express } from 'express'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

export const deserializeTransactionReceipt = (
    file: Express.Multer.File | undefined
): TransactionReceipt | undefined => {
    let receipt: TransactionReceipt | undefined = undefined
    if (file) {
        const { originalname, mimetype, buffer } = file

        if (originalname && mimetype && buffer) {
            receipt = {
                name: originalname,
                mimetype,
                buffer,
            }
        }
    }

    return receipt
}

export default upload
