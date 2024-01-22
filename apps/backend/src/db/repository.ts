import type {
    BankAccount,
    BlueprintKey,
    Investment,
    PaymentMethod,
    ProjectInvoice,
    TaxCategory,
    Transaction,
    TransactionBlueprint,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
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
    createTransaction: (
        _transaction: Transaction,
        _transactionReceipt?: TransactionReceipt
    ) => Promise<number>

    updateTransaction: (
        _transaction: Transaction,
        _transactionReceipt?: TransactionReceipt
    ) => Promise<void>

    getTransactions: (
        _context: TransactionContext,
        _paginationOptions: PaginationOptions
    ) => Promise<Transaction[]>

    getTransactionById: (_id: number) => Promise<Transaction>

    getTransactionReceipt: (_receiptId: number) => Promise<TransactionReceipt>

    getTransactionOrigins: () => Promise<string[]>

    // Investments data
    getInvestments: () => Promise<Investment[]>

    // Work data
    getProjectInvoices: () => Promise<ProjectInvoice[]>

    // Blueprints
    getActiveBlueprints: () => Promise<TransactionBlueprint[]>

    markBlueprintAsProcessed: (
        _blueprintKey: BlueprintKey,
        _dateProcessed: Date
    ) => Promise<void>
}
