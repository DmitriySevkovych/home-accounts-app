import { PickAndFlatten } from '../helpers/handy-types'

export type Project = {
    key: string
}

export type ProjectInvoiceStatus = 'OPEN' | 'PAID'

export type ProjectInvoice = {
    key: string
    issuanceDate: Date
    dueDate: Date
    project: PickAndFlatten<Project, 'key'>
    netAmount: number
    vat: number
    discount: number
    status: ProjectInvoiceStatus
    comment?: string
}
