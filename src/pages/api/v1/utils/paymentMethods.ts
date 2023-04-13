// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { getHttpLogger } from '../../../../logging/log-util'

//TODO: #8: load data from a DB
const temporarilyHardcodedData = [
    'EC',
    'TRANSFER',
    'PAYPAL',
    'CASH',
    'DIRECT_DEBIT',
    'SEPA',
]

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
    const httpLogger = getHttpLogger('api')
    httpLogger(req, res)

    switch (req.method) {
        case 'GET':
            res.status(200).json(temporarilyHardcodedData)
            break
        default:
            res.status(400)
            break
    }
}

export default handler
