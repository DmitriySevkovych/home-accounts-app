import type {
    BankAccount,
    BlueprintKey,
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
    TransactionBlueprint,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
} from 'domain-model'

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

    deleteTransaction: (_id: number) => Promise<void>

    getTransactions: (
        _context: TransactionContext,
        _paginationOptions: PaginationOptions
    ) => Promise<Transaction[]>

    getTransactionById: (_id: number) => Promise<Transaction>

    getTransactionByIds: (_ids: number[]) => Promise<Transaction[]>

    getTransactionReceipt: (_receiptId: number) => Promise<TransactionReceipt>

    getTransactionOrigins: () => Promise<string[]>

    getTransactionsAggregates: (
        _timeRange: TimeRange
    ) => Promise<TransactionAggregate[]>

    searchTransactions: (
        _parameters: SearchParameters,
        _paginationOptions: PaginationOptions
    ) => Promise<{ transactions: Transaction[] } & Paginated>

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
