import type {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'

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
                    bank: 'Piggy banke',
                    owner: 'Dmitriy and Ivanna',
                    category: 'private',
                    annualFee: 0.0,
                },
            ])
        })
    }
}
