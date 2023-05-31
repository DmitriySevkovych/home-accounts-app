import { TransactionDate } from './dates'

// TODO extract these helper types to somewhere else...
type UnionToIntersection<U> = (
    U extends any ? (_k: U) => void : never
) extends (_k: infer I) => void
    ? I
    : never
export type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>

// Types for utility data - TODO extract to somewhere else...
export type TransactionCategory = {
    category: string
    description?: string
}

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
    openingDate?: Date
    closingDate?: Date
    contact?: string
    comment?: string
}

// Transactions-related types
export type TransactionType = 'income' | 'expense'

type WorkSpecifics = {
    country: string
    vat: number
}

type InvestmentSpecifics = {
    investment: string
}

export class Transaction {
    // Unique identifier, to be provided by a DB sequence
    id?: number

    // Data describing
    category!: PickAndFlatten<TransactionCategory, 'category'>
    origin!: string
    description!: string
    date: TransactionDate = TransactionDate.today()
    tags: string[] = []

    // Data describing the money movement
    amount!: number
    exchangeRate: number = 1
    currency: string = 'EUR'
    paymentMethod!: PickAndFlatten<PaymentMethod, 'method'>
    sourceBankAccount?: PickAndFlatten<BankAccount, 'account'>
    targetBankAccount?: PickAndFlatten<BankAccount, 'account'>
    taxCategory?: PickAndFlatten<TaxCategory, 'category'>
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
        this.transaction.category = category
        this.transaction.origin = origin
        this.transaction.description = description
        return this
    }

    withId = (id: number): TransactionBuilder => {
        this.transaction.id = id
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

    withDate = (date: TransactionDate): TransactionBuilder => {
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
