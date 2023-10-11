import { PickAndFlatten } from './transactions.model'

export type Project = {
    key: string
}

export type ProjectInvoiceStatus = 'OPEN' | 'PAID'

export type ProjectInvoice = {
    key: string
    issuanceDate: Date // TODO consolidate with HomeAppDate... or ditch HomeAppDate
    dueDate: Date
    project: PickAndFlatten<Project, 'key'>
    netAmount: number
    vat: number
    discount: number
    status: ProjectInvoiceStatus
    comment?: string
}
