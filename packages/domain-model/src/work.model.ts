import { HomeAppDate } from './dates.model'
import { PickAndFlatten } from './transactions.model'

export type Project = {
    key: string
}

export type ProjectInvoiceStatus = 'OPEN' | 'PAID'

export type ProjectInvoice = {
    key: string
    issuanceDate: HomeAppDate
    dueDate: HomeAppDate
    project: PickAndFlatten<Project, 'key'>
    netAmount: number
    vat: number
    discount: number
    status: ProjectInvoiceStatus
    comment?: string
}
