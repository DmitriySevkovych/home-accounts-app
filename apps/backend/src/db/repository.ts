import type {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'

export interface Repository {
    close: () => Promise<void>
    ping: () => Promise<boolean>

    // Utility data
    getTransactionCategories: () => Promise<TransactionCategory[]>
    getTaxCategories: () => Promise<TaxCategory[]>
    getPaymentMethods: () => Promise<PaymentMethod[]>
    getBankAccounts: () => Promise<BankAccount[]>
}
