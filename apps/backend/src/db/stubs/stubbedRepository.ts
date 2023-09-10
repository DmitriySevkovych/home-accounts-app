import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    Transaction,
    TransactionCategory,
    minimalDummyTransaction,
} from 'domain-model'

import { NoRecordFoundInDatabaseError } from '../../helpers/errors'
import { PaginationOptions } from '../../helpers/pagination'
import { Repository } from '../repository'

export class StubbedRepository implements Repository {
    static CREATED_TRANSACTION_ID = 1234

    ping = (): Promise<boolean> => new Promise((resolve) => resolve(true))
    close = (): Promise<void> => new Promise((resolve) => resolve())

    // Utility data
    getTransactionCategories = (): Promise<TransactionCategory[]> => {
        return new Promise((resolve) => {
            resolve([
                {
                    category: 'FOOD',
                    allowedTypes: ['expense'],
                    description: 'Stubbed repository',
                },
                {
                    category: 'HOUSEHOLD',
                    allowedTypes: ['expense'],
                    description: 'Stubbed repository',
                },
                { category: 'TRANSPORTATION', allowedTypes: ['expense'] },
                {
                    category: 'BEAUTY',
                    allowedTypes: ['expense'],
                    description: 'Stubbed repository',
                },
                { category: 'LEISURE', allowedTypes: ['expense'] },
                {
                    category: 'VACATION',
                    allowedTypes: ['expense'],
                    description: 'Stubbed repository',
                },
                {
                    category: 'SALARY',
                    allowedTypes: ['income', 'expense'],
                    description: 'Stubbed repository',
                },
            ])
        })
    }

    getTaxCategories = (): Promise<TaxCategory[]> => {
        return new Promise((resolve) => {
            resolve([
                { category: 'EINKOMMENSTEUER' },
                { category: 'VERMIETUNG_UND_VERPACHTUNG' },
                { category: 'WERBUNGSKOSTEN' },
                { category: 'AUSSERORDENTLICHE_BELASTUNGEN' },
            ])
        })
    }

    getPaymentMethods = (): Promise<PaymentMethod[]> => {
        return new Promise((resolve) => {
            resolve([
                { method: 'EC' },
                { method: 'TRANSFER' },
                { method: 'PAYPAL' },
                { method: 'CASH' },
                { method: 'DIRECT_DEBIT' },
                { method: 'SEPA' },
            ])
        })
    }

    getBankAccounts = (): Promise<BankAccount[]> => {
        return new Promise((resolve) => {
            resolve([
                {
                    account: 'HOME_ACCOUNT',
                    bank: 'Bank Home',
                    owner: 'Ivanna',
                    category: 'private',
                    annualFee: 0.0,
                },
                {
                    account: 'WORK_ACCOUNT',
                    bank: 'Bank Work',
                    owner: 'Dmitriy',
                    category: 'business',
                    annualFee: 9.99,
                },
                {
                    account: 'INVESTMENT_ACCOUNT',
                    bank: 'Bank Inv',
                    owner: 'Dmitriy and Ivanna',
                    category: 'investment',
                    annualFee: 0.0,
                },
                {
                    account: 'CASH',
                    bank: 'Piggy bank',
                    owner: 'Dmitriy and Ivanna',
                    category: 'private',
                    annualFee: 0.0,
                },
            ])
        })
    }

    // Transactions
    createTransaction = (_transaction: Transaction) => {
        return Promise.resolve(StubbedRepository.CREATED_TRANSACTION_ID)
    }

    getTransactions = (
        paginationOptions: PaginationOptions
    ): Promise<Transaction[]> => {
        const transactions = []

        for (let i = 0; i < 10; i++) {
            const amount = Math.pow(-1, i) * (i + 1)
            const category =
                amount < 0
                    ? 'EXPENSE_CATEGORY_PLACEHOLDER'
                    : 'INCOME_CATEGORY_PLACEHOLDER'
            const transaction = minimalDummyTransaction(category, amount)
            transaction.id = i
            transactions.push(transaction)
        }

        const offset = paginationOptions?.offset ? paginationOptions?.offset : 0
        const limit = paginationOptions?.limit

        const start = offset
        const end = offset + limit
        return Promise.resolve(transactions.slice(start, end))
    }

    getTransactionById = (id: number): Promise<Transaction> => {
        if (id === 404) {
            throw new NoRecordFoundInDatabaseError(
                `The database does not hold a transaction with id=${id}.`
            )
        }

        const transaction = minimalDummyTransaction('FOOD', -33.33)
        transaction.id = id
        return Promise.resolve(transaction)
    }
}
