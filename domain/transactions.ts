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
    taxCategory?: string
    comment?: string

    // Work-related data
    country?: string
    vat?: number

    // Investment-related data
    investment?: string

    // Technical helper data
    agent: string = 'default_agent'

    type = (): TransactionType => {
        return this.amount > 0 ? 'income' : 'expense'
    }

    eurEquivalent = (): number => {
        return this.amount * this.exchangeRate
    }

    taxRelevant = (): boolean => {
        return this.taxCategory !== undefined
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

    withTaxCategory = (taxCategory: string): TransactionBuilder => {
        this.transaction.taxCategory = taxCategory
        return this
    }

    withDate = (date: Date): TransactionBuilder => {
        this.transaction.date = date
        return this
    }

    addTags = (tags: string[]): TransactionBuilder => {
        this.transaction.tags.push(...tags)
        return this
    }

    withPaymentDetails = (
        paymentMethod: string,
        sourceBankAccount: string,
        targetBankAccount: string
    ): TransactionBuilder => {
        this.transaction.paymentMethod = paymentMethod
        this.transaction.sourceBankAccount = sourceBankAccount
        this.transaction.targetBankAccount = targetBankAccount
        return this
    }

    withComment = (comment: string): TransactionBuilder => {
        this.transaction.comment = comment
        return this
    }

    withAgent = (agent: string): TransactionBuilder => {
        this.transaction.agent = agent
        return this
    }

    withVat = (vat: number): TransactionBuilder => {
        this.transaction.vat = vat
        return this
    }

    withCountry = (country: string): TransactionBuilder => {
        this.transaction.country = country
        return this
    }

    withInvestment = (investment: string): TransactionBuilder => {
        this.transaction.investment = investment
        return this
    }

    build = (): Transaction => {
        return this.transaction
    }
}

export const createTransaction = (): TransactionBuilder => {
    return new TransactionBuilder()
}
