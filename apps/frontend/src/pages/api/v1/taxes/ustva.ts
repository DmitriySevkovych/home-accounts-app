import { NextApiRequest, NextApiResponse } from 'next'

import { safeFetch } from '../../../../helpers/requests'
import { API } from '../../../../helpers/routes'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req
    const { owner, from, to } = req.query

    switch (method) {
        case 'GET':
            const url = new URL(API.client.taxes.ustva)
            url.searchParams.append('owner', owner as string)
            url.searchParams.append('from', from as string)
            url.searchParams.append('to', to as string)
            const result = await safeFetch(url.toString())
            return res.status(result.status).json(await result.json())

        default:
            break
    }
}
