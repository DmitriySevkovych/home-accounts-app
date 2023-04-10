export type TransactionType = 'income' | 'expense'

export class Transaction {
    // Data describing
    category!: string
    origin!: string
    description!: string
    date: Date = new Date()
    tags: string[] = []

    // Data describing the money movement
    amount!: number
    exchangeRate: number = 1
    currency: string = 'EUR'
    paymentMethod: string = 'EC'
    sourceBankAccount?: string
    targetBankAccount?: string
    // taxRelevant: boolean
    taxCategory?: string
    comment?: string

    // Technical helper data
    agent: string = 'default_agent'

    type = (): TransactionType => {
        return this.amount > 0 ? 'income' : 'expense'
    }

    eurEquivalent = (): number => {
        return this.amount * this.exchangeRate
    }
}

class TransactionBuilder {
    private transaction: Transaction

    constructor() {
        this.transaction = new Transaction()
    }

    about = (
        category: string,
        origin: string,
        description: string
    ): TransactionBuilder => {
        this.transaction.category = category
        this.transaction.origin = origin
        this.transaction.description = description
        return this
    }

    withAmount = (amount: number): TransactionBuilder => {
        this.transaction.amount = amount
        return this
    }

    withCurrency = (
        currency: string,
        exchangeRate: number
    ): TransactionBuilder => {
        this.transaction.currency = currency
        this.transaction.exchangeRate = exchangeRate
        return this
    }
    // TODO finish builder

    build = (): Transaction => {
        return this.transaction
    }
}

export const createTransaction = (): TransactionBuilder => {
    return new TransactionBuilder()
}
