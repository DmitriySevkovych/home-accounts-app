import { PickAndFlatten } from '../helpers/handy-types'
import { TimeRange } from './dates.model'
import {
    TransactionCategory,
    TransactionContext,
    TransactionType,
} from './transactions.model'

export type TransactionAggregate = {
    type: TransactionType
    context: TransactionContext
    category: PickAndFlatten<TransactionCategory, 'category'>
    amount: number
}

export type TransactionAggregationBin = {
    timeRange: TimeRange
    aggregates: TransactionAggregate[]
}
