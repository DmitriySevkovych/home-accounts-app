type BankAccount = string

type Document = {
    _id: number
    date: Date
    name: string
    mimetype: string
    buffer: BinaryData // TODO is this correct? is this necessary?
    description: string
}

//

type Expense = {
    _id: number
    type: string
    origin: string
    description: string
    transaction: Transaction
}

export type HomeExpense = Expense

export type WorkExpense = Expense & {
    country: string
    vat: number
}

export type InvestmentExpense = Expense & {
    investmentObject: string
}

//

export type Transaction = {
    _id: number
    date: Date
    amount: number
    currency: string
    exchange_rate: number
    source_bank_account: BankAccount
    target_bank_account: BankAccount
    agent: string
    payment_method: string
    // tax_relevant: boolean
    tax_category?: string
    comment?: string
    receipt_id?: number
}

export type TransactionReceipt = Document
