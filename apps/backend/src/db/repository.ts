import { type TransactionCategory } from 'domain-model/transactions'

export interface Repository {
    close: () => Promise<void>
    ping: () => boolean

    // Utility data
    getTransactionCategories: () => Promise<TransactionCategory[]>
    getTaxCategories: () => Promise<string[]>
    getPaymentMethods: () => Promise<string[]>
    getBankAccounts: () => Promise<string[]>
}
