import { TimeRange } from './dates.model'
import { Transaction } from './transactions.model'

export type TransactionAggregate = Pick<
    Transaction,
    'amount' | 'category' | 'context' | 'type'
> & { timeRange: TimeRange }

export type TransactionAggregateByOrigin = TransactionAggregate &
    Pick<Transaction, 'origin' | 'investment'>
