import { TransactionContext } from 'domain-model'
import type { NextApiRequest, NextApiResponse } from 'next'

import { safeFetch } from '../../../../helpers/requests'
import { API } from '../../../../helpers/routes'

type ResponseData = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let result: Response
    if (req.method === 'POST') {
        const upstream = await fetch(API.client.transactions.create, {
            method: 'POST',
            headers: {
                ...req.headers,
                host: undefined, // prevent host mismatch
            },
            body: req as unknown as BodyInit,
            duplex: 'half',
        })
        res.status(upstream.status)
        res.end()
    } else if (req.method === 'PUT') {
        const upstream = await fetch(API.client.transactions.update, {
            method: 'PUT',
            headers: {
                ...req.headers,
                host: undefined, // prevent host mismatch
            },
            body: req as unknown as BodyInit,
            duplex: 'half',
        })
        res.status(upstream.status)
        res.end()
    } else {
        const { context } = req.query
        result = await safeFetch(
            API.client.transactions.get(context as TransactionContext)
        )
        return res.status(result.status).json(await result.json())
    }
}

export const config = {
    api: {
        bodyParser: false, // IMPORTANT
    },
}
