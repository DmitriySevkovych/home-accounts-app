export interface Repository {
    close: () => Promise<void>
    ping: () => boolean

    // Utility data
    getTransactionCategories: () => Promise<string[]>
    getTaxCategories: () => Promise<string[]>
    getPaymentMethods: () => Promise<string[]>
    getBankAccounts: () => Promise<string[]>
}
