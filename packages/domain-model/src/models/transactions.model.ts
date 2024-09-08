import { PickAndFlatten } from '../helpers/handy-types'
import { dateFromString } from './dates.model'
import { TransactionValidationError } from './errors.model'
import { Investment } from './investments.model'
import {
    BankAccount,
    HomeAppFile,
    PaymentMethod,
    TaxCategory,
} from './utilities.model'
import { ProjectInvoice } from './work.model'

// Transactions-related types
export type TransactionType = 'income' | 'expense'

export type TransactionContext = 'home' | 'work' | 'investments'

export const transactionContexts: ReadonlyArray<TransactionContext> = [
    'home',
    'work',
    'investments',
]

export type TransactionCategory = {
    category: string
    context: TransactionContext
    canBeExpense: boolean
    canBeIncome: boolean
    canBeZerosum: boolean
}

export type TransactionReceipt = HomeAppFile

export class Transaction {
    // Unique identifier, to be provided by a DB sequence
    id?: number

    // Data describing what the transaction was for
    type!: TransactionType
    context!: TransactionContext
    category!: PickAndFlatten<TransactionCategory, 'category'>
    origin!: string
    description!: string
    date: Date = new Date()
    tags: string[] = []
    receipt?: TransactionReceipt

    // Data describing the money movement
    amount!: number
    exchangeRate: number = 1
    currency: string = 'EUR'
    paymentMethod!: PickAndFlatten<PaymentMethod, 'method'>
    sourceBankAccount?: PickAndFlatten<BankAccount, 'account'>
    targetBankAccount?: PickAndFlatten<BankAccount, 'account'>
    taxCategory?: PickAndFlatten<TaxCategory, 'category'>
    comment?: string

    // Additional data relevant in the work context
    invoiceKey?: PickAndFlatten<ProjectInvoice, 'key'>
    country?: string
    vat?: number

    // Additional data relevant in the investment context
    investment?: PickAndFlatten<Investment, 'key'>

    // Associated files
    receiptId?: number

    // Technical helper data
    agent: string = 'default_agent'

    eurEquivalent = (): number => {
        return this.amount * this.exchangeRate
    }

    exchangeRateWarning = (): boolean => {
        return (
            (this.currency !== 'EUR' && this.exchangeRate === 1) ||
            (this.currency === 'EUR' && this.exchangeRate !== 1)
        )
    }

    cashWarning = (): boolean => {
        const cashPaymentFromWrongAccount =
            this.paymentMethod === 'CASH' &&
            ((this.type === 'expense' && this.sourceBankAccount !== 'CASH') ||
                (this.type === 'income' && this.targetBankAccount !== 'CASH'))
        const cashAccountWithWrongPaymentType =
            ((this.type === 'expense' && this.sourceBankAccount === 'CASH') ||
                (this.type === 'income' &&
                    this.targetBankAccount === 'CASH')) &&
            this.paymentMethod !== 'CASH'
        return cashPaymentFromWrongAccount || cashAccountWithWrongPaymentType
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
        this.transaction.taxCategory = swapNullToUndefined(taxCategory)
        return this
    }

    withDate = (date: Date): TransactionBuilder => {
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
        paymentMethod: PickAndFlatten<PaymentMethod, 'method'>,
        sourceBankAccount: PickAndFlatten<BankAccount, 'account'>
    ): TransactionBuilder => {
        this.transaction.paymentMethod = paymentMethod
        this.transaction.sourceBankAccount =
            swapNullToUndefined(sourceBankAccount)
        return this
    }

    withPaymentTo = (
        paymentMethod: PickAndFlatten<PaymentMethod, 'method'>,
        targetBankAccount: PickAndFlatten<BankAccount, 'account'>
    ): TransactionBuilder => {
        this.transaction.paymentMethod = paymentMethod
        this.transaction.targetBankAccount =
            swapNullToUndefined(targetBankAccount)
        return this
    }

    withPaymentDetails = (
        paymentMethod: PickAndFlatten<PaymentMethod, 'method'>,
        sourceBankAccount: PickAndFlatten<BankAccount, 'account'>,
        targetBankAccount: PickAndFlatten<BankAccount, 'account'>
    ): TransactionBuilder => {
        this.transaction.paymentMethod = paymentMethod
        this.transaction.sourceBankAccount =
            swapNullToUndefined(sourceBankAccount)
        this.transaction.targetBankAccount =
            swapNullToUndefined(targetBankAccount)
        return this
    }

    withComment = (comment: string): TransactionBuilder => {
        this.transaction.comment = swapNullToUndefined(comment)
        return this
    }

    withInvestment = (
        investment: PickAndFlatten<Investment, 'key'>
    ): TransactionBuilder => {
        this.transaction.investment = swapNullToUndefined(investment)
        return this
    }

    withInvoice = (
        invoiceKey: PickAndFlatten<ProjectInvoice, 'key'>
    ): TransactionBuilder => {
        this.transaction.invoiceKey = swapNullToUndefined(invoiceKey)
        return this
    }

    withVAT = (vat: number, taxationCountry: string): TransactionBuilder => {
        this.transaction.vat = swapNullToUndefined(vat)
        this.transaction.country = swapNullToUndefined(taxationCountry)
        return this
    }

    withReceipt(receiptId: number) {
        this.transaction.receiptId = swapNullToUndefined(receiptId)
        return this
    }

    withAgent = (agent: string): TransactionBuilder => {
        this.transaction.agent = agent
        return this
    }

    validate = (): TransactionBuilder => {
        this._commonValidations()

        const { date } = this.transaction
        this._throwIfFalsy('date', date)

        return this
    }

    validateForBlueprint = (): TransactionBuilder => {
        this._commonValidations()

        return this
    }

    build = (): Transaction => {
        return this.transaction
    }

    private _commonValidations = (): TransactionBuilder => {
        const {
            category,
            origin,
            amount,
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

        this._throwIfAmountInconsistentWithBankAccounts()

        this._throwIfAmountInconsistentWithType(amount, type)

        this._throwIfContextSpecificsAreMissing()

        return this
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

    private _throwIfContextSpecificsAreMissing = (): void => {
        const { context, type: transactionType } = this.transaction

        if (context === 'work' && transactionType === 'expense') {
            const { vat, country } = this.transaction
            if (vat !== 0 && !vat) {
                throw new TransactionValidationError(
                    `The transaction context '${context}' requires the attribute 'vat' to be set.`
                )
            }
            if (!country) {
                throw new TransactionValidationError(
                    `The transaction context '${context}' requires the attribute 'country' to be set.`
                )
            }
        } else if (context === 'work' && transactionType === 'income') {
            const { invoiceKey, category } = this.transaction
            if (!invoiceKey && ['SALARY'].includes(category)) {
                throw new TransactionValidationError(
                    `The transaction context '${context}' requires the attribute 'invoiceKey' to be set if category is ${category}.`
                )
            }
        } else if (context === 'investments') {
            const { investment } = this.transaction
            if (!investment) {
                throw new TransactionValidationError(
                    `The transaction context '${context}' requires the attribute 'investment' to be set.`
                )
            }
        }
    }
}

export const createTransaction = (): TransactionBuilder => {
    return new TransactionBuilder()
}

export const deserializeTransaction = (data: any): Transaction => {
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
        taxCategory,
        type,
        context,
        vat,
        country,
        invoiceKey,
        investment,
        receiptId,
    } = data

    const transaction: Transaction = createTransaction()
        .about(category, origin, description)
        .withType(type)
        .withContext(context)
        .withAmount(amount)
        .withCurrency(currency, exchangeRate)
        .withDate(dateFromString(date))
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withTaxCategory(taxCategory)
        .withComment(comment)
        .withAgent(agent)
        .withId(id)
        .withVAT(vat, country)
        .withInvoice(invoiceKey)
        .withInvestment(investment)
        .withReceipt(receiptId)
        .addTags(tags)
        .validate()
        .build()

    return transaction
}

export const swapNullToUndefined = (value: any): any =>
    value === null ? undefined : value
