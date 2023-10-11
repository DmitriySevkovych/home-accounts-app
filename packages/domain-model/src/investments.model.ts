import { PickAndFlatten } from './transactions.model'

export type InvestmentType = {
    type: string
}

export type Investment = {
    key: string
    type: PickAndFlatten<InvestmentType, 'type'>
    description: string
    startDate: Date // TODO unify with HomeAppDate? Or remove HomeAppDate?
    endDate?: Date // TODO unify with HomeAppDate? Or remove HomeAppDate?
}
