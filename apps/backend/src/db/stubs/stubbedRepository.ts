import {
    BankAccount,
    HomeAppFile,
    Investment,
    Paginated,
    PaginationOptions,
    PaymentMethod,
    ProjectInvoice,
    SearchParameters,
    TaxCategory,
    TimeRange,
    Transaction,
    TransactionAggregate,
    TransactionAggregateByMonth,
    TransactionBlueprint,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
    dateFromString,
    minimalDummyInvestmentTransaction,
    minimalDummyTransaction,
    minimalDummyWorkTransaction,
} from 'domain-model'

import { NoRecordFoundInDatabaseError } from '../../helpers/errors'
import { getLimitAndOffset } from '../../helpers/pagination'
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
                    context: 'home',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'HOUSEHOLD',
                    context: 'home',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'TRANSPORTATION',
                    context: 'home',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'TRANSPORTATION',
                    context: 'work',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'TRANSPORTATION',
                    context: 'investments',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'BEAUTY',
                    context: 'home',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'LEISURE',
                    context: 'home',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'VACATION',
                    context: 'home',
                    canBeExpense: true,
                    canBeIncome: false,
                    canBeZerosum: false,
                },
                {
                    category: 'SALARY',
                    context: 'home',
                    canBeExpense: true,
                    canBeIncome: true,
                    canBeZerosum: false,
                },
                {
                    category: 'SALARY',
                    context: 'work',
                    canBeExpense: true,
                    canBeIncome: true,
                    canBeZerosum: false,
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

    updateTransaction = async (
        _transaction: Transaction,
        _transactionReceipt?: HomeAppFile | undefined
    ) => {
        Promise.resolve()
    }

    deleteTransaction = async (_id: number): Promise<void> => {
        Promise.resolve()
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

        const { limit, offset } = getLimitAndOffset(paginationOptions)

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

    getTransactionByIds = (ids: number[]): Promise<Transaction[]> => {
        const transactions = ids.map((id) => {
            const transaction = this._getDummyTransaction('FEE', -1 * id)
            transaction.id = id
            return transaction
        })

        return Promise.resolve(transactions)
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

    getTransactionOrigins = (): Promise<string[]> => {
        return Promise.resolve(['Gas station', 'Supermarket', 'Post office'])
    }

    getTransactionsAggregates = (
        _timeRange: TimeRange
    ): Promise<TransactionAggregate[]> => {
        throw new Error('stub not implemented')
    }

    getTransactionsAggregatesByMonth = (
        _timeRange: TimeRange
    ): Promise<TransactionAggregateByMonth[]> => {
        throw new Error('stub not implemented')
    }

    searchTransactions = async (
        _parameters: SearchParameters,
        _paginationOptions: PaginationOptions
    ): Promise<{ transactions: Transaction[] } & Paginated> => {
        throw new Error('stub not implemented')
    }

    // Investments
    getInvestments = async (): Promise<Investment[]> => {
        return Promise.resolve([
            {
                key: 'Apartment',
                type: 'REAL_ESTATE',
                description: 'A 2/1 flat',
                startDate: dateFromString('2012-12-12'),
            },
            {
                key: 'Homebrew',
                type: 'CRAFT',
                description: 'A 2/1 flat',
                startDate: dateFromString('2012-12-12'),
            },
            {
                key: 'Stock_Portfolio',
                type: 'STOCKS',
                description: 'A 2/1 flat',
                startDate: dateFromString('2012-12-12'),
            },
            {
                key: 'Precious_Metals',
                type: 'TANGIBLES',
                description: 'A 2/1 flat',
                startDate: dateFromString('2012-12-12'),
            },
        ])
    }

    // Work
    getProjectInvoices = (): Promise<ProjectInvoice[]> => {
        return Promise.resolve([
            {
                key: 'INV-0123456',
                issuanceDate: dateFromString('2019-05-01'),
                dueDate: dateFromString('2019-06-01'),
                project: 'PROJECT_X',
                netAmount: 12333.45,
                vat: 0.19,
                discount: 0,
                status: 'OPEN',
                comment: 'Dummy invoce',
            },
            {
                key: 'INV-0123457',
                issuanceDate: dateFromString('2019-07-03'),
                dueDate: dateFromString('2019-08-02'),
                project: 'PROJECT_Y',
                netAmount: 5432.1,
                vat: 0.19,
                discount: 0.03,
                status: 'PAID',
                comment: 'Second dummy invoce',
            },
        ])
    }

    // Blueprints
    getActiveBlueprints = async (): Promise<TransactionBlueprint[]> => []

    markBlueprintAsProcessed = async (
        _blueprintKey: Uppercase<string>,
        _dateProcessed: Date
    ) => {}

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
