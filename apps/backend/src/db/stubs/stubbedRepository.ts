import { TransactionCategory } from 'domain-model'

import { Repository } from '../repository'

export class StubbedRepository implements Repository {
    ping = () => true
    close = (): Promise<void> => new Promise((resolve) => resolve())

    // Utility data
    getTransactionCategories = (): Promise<TransactionCategory[]> => {
        return new Promise((resolve) => {
            resolve([
                { category: 'FOOD', description: 'Stubbed repository' },
                { category: 'HOUSEHOLD', description: 'Stubbed repository' },
                { category: 'TRANSPORTATION' },
                { category: 'BEAUTY', description: 'Stubbed repository' },
                { category: 'LEISURE' },
                { category: 'VACATION', description: 'Stubbed repository' },
            ])
        })
    }

    getTaxCategories = (): Promise<string[]> => {
        return new Promise((resolve) => {
            resolve([
                'EINKOMMENSTEUER',
                'VERMIETUNG_UND_VERPACHTUNG',
                'WERBUNGSKOSTEN',
                'AUSSERORDENTLICHE_BELASTUNGEN',
            ])
        })
    }

    getPaymentMethods = (): Promise<string[]> => {
        return new Promise((resolve) => {
            resolve([
                'EC',
                'TRANSFER',
                'PAYPAL',
                'CASH',
                'DIRECT_DEBIT',
                'SEPA',
            ])
        })
    }

    getBankAccounts = (): Promise<string[]> => {
        return new Promise((resolve) => {
            resolve([
                'KSKWN',
                'CoBa Premium',
                'CoBa Business',
                'VoBa Invest',
                'CASH',
            ])
        })
    }
}
