import { TimeRange } from './dates.model'
import { Transaction } from './transactions.model'

export type TransactionAggregate = Pick<
    Transaction,
    'amount' | 'category' | 'context' | 'origin' | 'type' | 'investment'
>

export type TransactionAggregationBin = {
    timeRange: TimeRange
    aggregates: TransactionAggregate[]
}
