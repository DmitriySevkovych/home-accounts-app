import { PickAndFlatten } from './transactions.model'

export type InvestmentType = {
    type: string
}

export type Investment = {
    key: string
    type: PickAndFlatten<InvestmentType, 'type'>
    description: string
    startDate: Date // TODO unify with TransactionDate? Or remove TransactionDate?
    endDate?: Date // TODO unify with TransactionDate? Or remove TransactionDate?
}
