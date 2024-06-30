import { TimeRange } from './dates.model'
import { Transaction } from './transactions.model'

export type TransactionAggregate = Pick<
    Transaction,
    'amount' | 'category' | 'context' | 'origin' | 'type' | 'investment'
> & { timeRange: TimeRange }

// TODO unify
export type TransactionAggregateByMonth = Pick<
    Transaction,
    'amount' | 'category' | 'context' | 'type'
> & { timeRange: TimeRange }
