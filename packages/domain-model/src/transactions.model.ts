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
    allowedTypes: TransactionType[]
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

export type TransactionContext = 'home' | 'work' | 'investments'

// type WorkContext = {
//     country: string
//     vat: number
// }

// type InvestmentContext = {
//     investment: string
// }

export class Transaction {
    // Unique identifier, to be provided by a DB sequence
    id?: number

    // Data describing ...
    category!: PickAndFlatten<TransactionCategory, 'category'>
    origin!: string
    description!: string
    date: TransactionDate = TransactionDate.today()
    tags: string[] = []

    // Data describing the money movement
    type!: TransactionType
    context!: TransactionContext
    amount!: number
    exchangeRate: number = 1
    currency: string = 'EUR'
    paymentMethod!: PickAndFlatten<PaymentMethod, 'method'>
    sourceBankAccount?: PickAndFlatten<BankAccount, 'account'>
    targetBankAccount?: PickAndFlatten<BankAccount, 'account'>
    taxCategory?: PickAndFlatten<TaxCategory, 'category'>
    comment?: string

    // Technical helper data
    agent: string = 'default_agent'

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

    withType = (type: TransactionType): TransactionBuilder => {
        this.transaction.type = type
        return this
    }

    withContext = (context: TransactionContext): TransactionBuilder => {
        this.transaction.context = context
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
            type,
            context,
        } = this.transaction

        this._throwIfFalsy('category', category)
        this._throwIfFalsy('origin', origin)
        this._throwIfFalsy('amount', amount)
        this._throwIfFalsy('type', type)
        this._throwIfFalsy('context', context)
        this._throwIfFalsy('payment method', paymentMethod)
        this._throwIfFalsy('agent', agent)
        this._throwIfFalsy(
            'bank accounts',
            sourceBankAccount || targetBankAccount
        )

        this._throwIfDateInvalid(date)

        this._throwIfAmountInconsistentWithBankAccounts()

        this._throwIfAmountInconsistentWithType(amount, type)

        return this
    }

    build = (): Transaction => {
        return this.transaction
    }

    private _throwIfFalsy = (property: string, value: any): void => {
        // throw an error, if input is undefined, null, '', 0 and so on
        if (!value) {
            throw new TransactionValidationError(
                `The transaction attribute '${property}' is falsy. Can not build a valid Transaction object.`
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

    private _throwIfDateInvalid = (date: TransactionDate): void => {
        this._throwIfFalsy('date', date)

        if (date.toString() === 'Invalid DateTime') {
            throw new TransactionValidationError(
                'The Transaction has an invalid date'
            )
        }
    }

    private _throwIfAmountInconsistentWithType = (
        amount: number,
        type: TransactionType
    ): void => {
        if (
            (amount < 0 && type === 'income') ||
            (amount > 0 && type === 'expense')
        ) {
            throw new TransactionValidationError(
                `The transaction type '${type}' is inconsistent with transaction amount of '${amount}'`
            )
        }
    }
}

export const createTransaction = (): TransactionBuilder => {
    return new TransactionBuilder()
}

export const deserializeTransaction = (data: any) => {
    const {
        id,
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
        type,
        context,
    } = data

    const transaction: Transaction = createTransaction()
        .about(category, origin, description)
        .withType(type)
        .withContext(context)
        .withAmount(amount)
        .withCurrency(currency, exchangeRate)
        .withDate(TransactionDate.deserialize(date))
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withComment(comment)
        .withAgent(agent)
        .withId(id)
        .addTags(tags)
        .validate()
        .build()

    return transaction
}
