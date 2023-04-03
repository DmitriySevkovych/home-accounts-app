export type TransactionType = 'income' | 'expense'

export interface TransactionBlueprint {
    date?: Date
    amount: number
    exchangeRate?: number
    currency?: string
    sourceBankAccount?: string | undefined
    targetBankAccount?: string | undefined
}

export class Transaction implements TransactionBlueprint {
    amount: number
    exchangeRate: number = 1
    currency: string = 'EUR'
    date: Date = new Date()
    sourceBankAccount?: string | undefined
    targetBankAccount?: string | undefined

    constructor(data: TransactionBlueprint) {
        this.amount = data.amount
        this.exchangeRate = data.exchangeRate ? data.exchangeRate : 1
        this.currency = data.currency ? data.currency : 'EUR'
        this.date = data.date ? data.date : new Date()
        this.sourceBankAccount = data.sourceBankAccount
        this.targetBankAccount = data.targetBankAccount
    }

    type = (): TransactionType => {
        return this.amount > 0 ? 'income' : 'expense'
    }

    eurEquivalent = (): number => {
        return this.amount * this.exchangeRate
    }
}
