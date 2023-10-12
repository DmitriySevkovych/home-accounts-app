import { HomeAppDate } from './dates.model'
import { PickAndFlatten } from './transactions.model'

export type InvestmentType = {
    type: string
}

export type Investment = {
    key: string
    type: PickAndFlatten<InvestmentType, 'type'>
    description: string
    startDate: HomeAppDate
    endDate?: HomeAppDate
}
