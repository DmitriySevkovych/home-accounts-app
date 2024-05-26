import { TransactionAggregationBin, dateFromString } from 'domain-model'
import express, { type Router } from 'express'

import { RepositoryLocator } from '../db/repositoryLocator'
import { TypedRequestBody, TypedResponse } from '../definitions/requests'

type AggregationResponseData = {
    aggregationBins: TransactionAggregationBin[]
}

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.post(
        '/aggregation',
        async (
            req: TypedRequestBody<{
                timeRange: { from: string; until: string }
            }>,
            res: TypedResponse<AggregationResponseData>
        ) => {
            const timeRange = {
                from: dateFromString(req.body.timeRange.from),
                until: dateFromString(req.body.timeRange.until),
            }

            const data = {
                aggregationBins: [
                    {
                        timeRange: timeRange,
                        aggregates: await repository.getTransactionsAggregates(
                            timeRange
                        ),
                    },
                ],
            }
            res.status(200).json(data)
        }
    )

    return router
}

export default getRouter
