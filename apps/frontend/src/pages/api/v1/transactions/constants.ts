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
            const urls = API.client.transactions.constants.getAll()

            try {
                const response = await Promise.all(
                    urls.map((url) => safeFetch(url).then((res) => res.json()))
                )

                const constants = {
                    ...response[0],
                    ...response[1],
                    ...response[2],
                    ...response[3],
                }

                return res.status(200).json(constants)
            } catch {
                return res
                    .status(500)
                    .json(
                        JSON.stringify({ message: 'Error fetching constants' })
                    )
            }

        default:
            break
    }
}
