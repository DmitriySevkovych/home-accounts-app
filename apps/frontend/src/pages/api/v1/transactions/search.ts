import { NextApiRequest, NextApiResponse } from 'next'

import { safeFetch } from '../../../../helpers/requests'
import { API } from '../../../../helpers/routes'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req
    const { page } = req.query

    if (!page)
        return res
            .status(400)
            .json({
                message: 'Bad request, page query parameter missing or empty.',
            })

    switch (method) {
        case 'POST':
            const result = await safeFetch(
                API.client.transactions.search({
                    page: parseInt(page as string),
                }),
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(req.body),
                }
            )
            return res.status(result.status).json(await result.json())

        default:
            break
    }
}
