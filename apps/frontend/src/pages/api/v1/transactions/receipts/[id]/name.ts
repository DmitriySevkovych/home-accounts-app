import { NextApiRequest, NextApiResponse } from 'next'

import { safeFetch } from '../../../../../../helpers/requests'
import { API } from '../../../../../../helpers/routes'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req
    const { id: receiptId } = req.query

    if (!receiptId)
        return res
            .status(400)
            .json({ message: 'Bad request, receiptId missing or empty.' })

    switch (method) {
        case 'GET':
            const result = await safeFetch(
                API.client.transactions.receipts.getNameOf(
                    parseInt(receiptId as string)
                )
            )
            return res.status(result.status).json(await result.json())

        default:
            break
    }
}
