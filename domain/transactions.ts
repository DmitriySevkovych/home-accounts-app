export type TransactionType = 'income' | 'expense'

export interface TransactionBlueprint {
    amount: number
    exchangeRate?: number
    currency?: string
}

export class Transaction implements TransactionBlueprint {
    amount: number
    exchangeRate: number = 1
    currency: string = 'EUR'

    constructor(data: TransactionBlueprint) {
        this.amount = data.amount
        this.exchangeRate = data.exchangeRate ? data.exchangeRate : 1
        this.currency = data.currency ? data.currency : 'EUR'
    }

    type = (): TransactionType => {
        return this.amount > 0 ? 'income' : 'expense'
    }

    eurEquivalent = (): number => {
        return this.amount * this.exchangeRate
    }
}
