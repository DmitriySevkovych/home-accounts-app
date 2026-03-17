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

// Umsatzsteuer per month
export type OutputVATSummary = {
    year: number
    month: number
    declareUntil: string
    invoices: string
    vat: number
    netAmount: number
    taxAmount: number
}

// Vorsteuer per month
export type InputVATSummary = {
    year: number
    month: number
    declareUntil: string
    country: string
    expenseCategories: string
    expenseIds: string
    expenseTotal: number
    inputTaxAmount: number
}

export type USTVA = {
    output: OutputVATSummary
    input: InputVATSummary[]
}
