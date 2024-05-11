import { TimeRange } from './dates.model'
import { Transaction } from './transactions.model'

export type TransactionAggregate = Pick<
    Transaction,
    'amount' | 'category' | 'context' | 'origin' | 'type'
>

export type TransactionAggregationBin = {
    timeRange: TimeRange
    aggregates: TransactionAggregate[]
}
