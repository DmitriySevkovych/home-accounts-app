import { TransactionAggregate, dateFromString } from 'domain-model'
import express, { type Router } from 'express'

import { RepositoryLocator } from '../db/repositoryLocator'
import { TypedRequestBody, TypedResponse } from '../definitions/requests'

type AggregationResponseData = {
    aggregates: TransactionAggregate[]
}

const getRouter = (): Router => {
    const router = express.Router()
    const repository = RepositoryLocator.getRepository()

    router.post(
        '/aggregation',
        async (
            req: TypedRequestBody<{
                timeRange: { from: string; until: string }
                groupByMonth?: boolean
            }>,
            res: TypedResponse<AggregationResponseData>
        ) => {
            const timeRange = {
                from: dateFromString(req.body.timeRange.from),
                until: dateFromString(req.body.timeRange.until),
            }

            // TODO refactor
            let data
            if (req.body.groupByMonth) {
                data = await repository.getTransactionsAggregatesByMonth(
                    timeRange
                )
            } else {
                data = await repository.getTransactionsAggregatesByOrigin(
                    timeRange
                )
            }
            res.status(200).json({ aggregates: data })
        }
    )

    return router
}

export default getRouter
