export type TransactionType = 'income' | 'expense'

type WorkSpecifics = {
    country: string
    vat: number
}

type InvestmentSpecifics = {
    investment: string
}

export type TransactionCategory = {
    category: string
    description?: string
}

export class Transaction {
    // Data describing
    category!: Pick<TransactionCategory, 'category'>
    origin!: string
    description!: string
    date: Date = new Date()
    tags: string[] = []

    // Data describing the money movement
    amount!: number
    exchangeRate: number = 1
    currency: string = 'EUR'
    paymentMethod!: string
    sourceBankAccount?: string
    targetBankAccount?: string
    taxCategory?: string
    comment?: string

    // Work-related or investment-related data
    specifics?: WorkSpecifics | InvestmentSpecifics

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
        this.transaction.category = { category }
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

    withPaymentFrom = (
        paymentMethod: string,
        sourceBankAccount: string
    ): TransactionBuilder => {
        this.transaction.paymentMethod = paymentMethod
        this.transaction.sourceBankAccount = sourceBankAccount
        return this
    }

    withPaymentTo = (
        paymentMethod: string,
        targetBankAccount: string
    ): TransactionBuilder => {
        this.transaction.paymentMethod = paymentMethod
        this.transaction.targetBankAccount = targetBankAccount
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

    withSpecifics = (
        specifics: WorkSpecifics | InvestmentSpecifics
    ): TransactionBuilder => {
        this.transaction.specifics = specifics
        return this
    }

    build = (): Transaction => {
        return this.transaction
    }
}

export const createTransaction = (): TransactionBuilder => {
    return new TransactionBuilder()
}
