import { TransactionDate } from './dates.model'
import { TransactionValidationError } from './errors.model'

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
export type TransactionType = {
    cashflow: 'income' | 'expense'
    specificTo: 'home' | 'work' | 'investment'
}

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
        const cashflow = this.amount > 0 ? 'income' : 'expense'
        if (this.specifics) {
            if ('investment' in this.specifics) {
                return { cashflow, specificTo: 'investment' }
            }
            return { cashflow, specificTo: 'work' }
        }
        return { cashflow, specificTo: 'home' }
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
        // TODO maybe remove the default values and remove this if statement
        if (currency && exchangeRate) {
            this.transaction.currency = currency
            this.transaction.exchangeRate = exchangeRate
        }
        return this
    }

    withTaxCategory = (taxCategory: string): TransactionBuilder => {
        this.transaction.taxCategory = taxCategory
        return this
    }

    withDate = (date: TransactionDate): TransactionBuilder => {
        // TODO maybe remove the default date value and remove this if statement
        if (date) {
            this.transaction.date = date
        }
        return this
    }

    addTags = (tags: string[] | undefined): TransactionBuilder => {
        if (tags) {
            this.transaction.tags.push(...tags)
        }
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

    validate = (): TransactionBuilder => {
        const {
            category,
            origin,
            amount,
            date,
            paymentMethod,
            sourceBankAccount,
            targetBankAccount,
            agent,
        } = this.transaction

        this._throwIfFalsy('category', category)
        this._throwIfFalsy('origin', origin)
        this._throwIfFalsy('amount', amount)
        this._throwIfFalsy('date', date)
        this._throwIfFalsy('payment method', paymentMethod)
        this._throwIfFalsy('agent', agent)
        this._throwIfFalsy(
            'bank accounts',
            sourceBankAccount || targetBankAccount
        )

        this._throwIfAmountInconsistentWithBankAccounts()

        return this
    }

    build = (): Transaction => {
        return this.transaction
    }

    private _throwIfFalsy = (property: string, value: any): void => {
        // throw an error, if input is undefined, null, '', 0 and so on
        if (!value) {
            throw new TransactionValidationError(
                `The data on ${property} is falsy. Can not build a valid Transaction object.`
            )
        }
    }

    private _throwIfAmountInconsistentWithBankAccounts = (): void => {
        const { amount, sourceBankAccount, targetBankAccount } =
            this.transaction

        if (amount < 0 && !sourceBankAccount) {
            throw new TransactionValidationError(
                `A Transaction with amount < 0 should have a source (outgoing) bank account set`
            )
        } else if (amount > 0 && !targetBankAccount) {
            throw new TransactionValidationError(
                `A Transaction with amount > 0 should have a target (incoming) bank account set`
            )
        }
    }
}

export const createTransaction = (): TransactionBuilder => {
    return new TransactionBuilder()
}

export const deserializeTransaction = (data: any) => {
    const {
        category,
        origin,
        description,
        amount,
        currency,
        exchangeRate,
        date,
        paymentMethod,
        sourceBankAccount,
        targetBankAccount,
        comment,
        agent,
        tags,
    } = data

    const transaction: Transaction = createTransaction()
        .about(category, origin, description)
        .withAmount(amount)
        .withCurrency(currency, exchangeRate)
        .withDate(date)
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withComment(comment)
        .withAgent(agent)
        .addTags(tags)
        .validate()
        .build()

    return transaction
}
