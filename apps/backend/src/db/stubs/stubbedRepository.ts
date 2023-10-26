import {
    BankAccount,
    HomeAppDate,
    Investment,
    PaymentMethod,
    ProjectInvoice,
    TaxCategory,
    Transaction,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
    minimalDummyInvestmentTransaction,
    minimalDummyTransaction,
    minimalDummyWorkTransaction,
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

    getTags = (): Promise<string[]> => {
        return new Promise((resolve) => {
            resolve(['Tag1', 'Tag2', 'Tag2'])
        })
    }

    // Transactions
    createTransaction = (
        _transaction: Transaction,
        _transactionReceipt?: TransactionReceipt
    ) => {
        return Promise.resolve(StubbedRepository.CREATED_TRANSACTION_ID)
    }

    getTransactions = (
        context: TransactionContext,
        paginationOptions: PaginationOptions
    ): Promise<Transaction[]> => {
        const transactions = []

        for (let i = 0; i < 10; i++) {
            const amount = Math.pow(-1, i) * (i + 1)
            const category =
                amount < 0
                    ? 'EXPENSE_CATEGORY_PLACEHOLDER'
                    : 'INCOME_CATEGORY_PLACEHOLDER'
            const transaction = this._getDummyTransaction(
                category,
                amount,
                context
            )
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

        const transaction = this._getDummyTransaction('FEE', -33.33)
        transaction.id = id
        return Promise.resolve(transaction)
    }

    getTransactionReceipt = (
        receiptId: number
    ): Promise<TransactionReceipt> => {
        if (receiptId === 404) {
            throw new NoRecordFoundInDatabaseError(
                `The database does not hold a transaction with id=${receiptId}.`
            )
        }

        return Promise.resolve({
            name: 'hello.txt',
            mimetype: 'text/plain',
            buffer: Buffer.from('This is a sample text file'),
        })
    }

    // Investments
    getInvestments = async (): Promise<Investment[]> => {
        return Promise.resolve([
            {
                key: 'Apartment',
                type: 'REAL_ESTATE',
                description: 'A 2/1 flat',
                startDate: HomeAppDate.fromString('2012-12-12'),
            },
            {
                key: 'Homebrew',
                type: 'CRAFT',
                description: 'A 2/1 flat',
                startDate: HomeAppDate.fromString('2012-12-12'),
            },
            {
                key: 'Stock_Portfolio',
                type: 'STOCKS',
                description: 'A 2/1 flat',
                startDate: HomeAppDate.fromString('2012-12-12'),
            },
            {
                key: 'Precious_Metals',
                type: 'TANGIBLES',
                description: 'A 2/1 flat',
                startDate: HomeAppDate.fromString('2012-12-12'),
            },
        ])
    }

    // Work
    getProjectInvoices = (): Promise<ProjectInvoice[]> => {
        return Promise.resolve([
            {
                key: 'INV-0123456',
                issuanceDate: HomeAppDate.fromString('2019-05-01'),
                dueDate: HomeAppDate.fromString('2019-06-01'),
                project: 'PROJECT_X',
                netAmount: 12333.45,
                vat: 0.19,
                discount: 0,
                status: 'OPEN',
                comment: 'Dummy invoce',
            },
            {
                key: 'INV-0123457',
                issuanceDate: HomeAppDate.fromString('2019-07-03'),
                dueDate: HomeAppDate.fromString('2019-08-02'),
                project: 'PROJECT_Y',
                netAmount: 5432.1,
                vat: 0.19,
                discount: 0.03,
                status: 'PAID',
                comment: 'Second dummy invoce',
            },
        ])
    }

    /* 
        Private helper functions 
    */
    _getDummyTransaction = (
        category: string,
        amount: number,
        context: TransactionContext = 'home'
    ) => {
        let getDummyTransaction
        switch (context) {
            case 'work':
                getDummyTransaction = minimalDummyWorkTransaction
                break
            case 'investments':
                getDummyTransaction = minimalDummyInvestmentTransaction
                break
            default:
                getDummyTransaction = minimalDummyTransaction
        }

        return getDummyTransaction(category, amount)
    }
}
