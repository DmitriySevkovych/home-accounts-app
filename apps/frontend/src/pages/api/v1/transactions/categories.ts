import { NextApiRequest, NextApiResponse } from 'next'

import { safeFetch } from '../../../../helpers/requests'
import { API } from '../../../../helpers/routes'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            const result = await safeFetch(
                API.client.transactions.constants.getCategories
            )
            return res.status(result.status).json(await result.json())

        default:
            break
    }
}
