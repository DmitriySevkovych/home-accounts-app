import type {
    BankAccount,
    Investment,
    PaymentMethod,
    TaxCategory,
    Transaction,
    TransactionCategory,
} from 'domain-model'

import { PaginationOptions } from '../helpers/pagination'

export interface Repository {
    close: () => Promise<void>
    ping: () => Promise<boolean>

    // Utility data
    getTransactionCategories: () => Promise<TransactionCategory[]>
    getTaxCategories: () => Promise<TaxCategory[]>
    getPaymentMethods: () => Promise<PaymentMethod[]>
    getBankAccounts: () => Promise<BankAccount[]>
    getTags: () => Promise<string[]>

    // Transactions data
    createTransaction: (_transaction: Transaction) => Promise<number>

    getTransactions: (
        _paginationOptions: PaginationOptions
    ) => Promise<Transaction[]>

    getTransactionById: (_id: number) => Promise<Transaction>

    // Investments data
    getInvestments: () => Promise<Investment[]>
}
