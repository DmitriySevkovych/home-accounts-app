import { PickAndFlatten } from '../helpers/handy-types'

export type InvestmentType = {
    type: string
}

export type Investment = {
    key: string
    type: PickAndFlatten<InvestmentType, 'type'>
    description: string
    startDate: Date
    endDate?: Date
}
