import { HomeAppDate } from './dates.model'

export type TaxCategory = {
    category: string
    description?: string
}

export type PaymentMethod = {
    method: string
    description?: string
}

export type BankAccount = {
    account: string
    bank: string
    annualFee: number
    category: 'private' | 'business' | 'investment'
    owner?: 'Dmitriy' | 'Ivanna' | 'Dmitriy and Ivanna'
    purpose?: string
    iban?: string
    openingDate?: HomeAppDate
    closingDate?: HomeAppDate
    contact?: string
    comment?: string
}

export type HomeAppFile = {
    id?: number
    name: string
    mimetype: string
    buffer: Buffer
}

export type HomeAppDocument = HomeAppFile & {
    date: HomeAppDate
    description: string
}
