import { TransactionContext, TransactionType } from 'domain-model'

export const CLIENT_BACKEND_BASE_URL = process.env['NEXT_PUBLIC_BACKEND_URL']
export const SERVER_BACKEND_BASE_URL = process.env['BACKEND_URL']

export const PAGES = {
    transactions: {
        index: '/transactions',
        new: '/transactions/new',
        success: (type: TransactionType) =>
            `/transactions/congrats?transactionType=${type}`,
        edit: (id: number) => `/transactions/${id}`,
    },
} as const

export const API = {
    client: {
        transactions: {
            create: `${CLIENT_BACKEND_BASE_URL}/transactions`,
            update: `${CLIENT_BACKEND_BASE_URL}/transactions`,
            get: (context: TransactionContext, limit: number) =>
                `${CLIENT_BACKEND_BASE_URL}/transactions?context=${context}&limit=${limit}`,
        },
    },
    server: {
        system: {
            info: `${SERVER_BACKEND_BASE_URL}/system/info`,
        },
        transactions: {
            constants: [
                `${SERVER_BACKEND_BASE_URL}/utils/constants/transactions`,
                `${SERVER_BACKEND_BASE_URL}/investments`,
                `${SERVER_BACKEND_BASE_URL}/work/invoices`,
                `${SERVER_BACKEND_BASE_URL}/transactions/origins`,
            ],
            getById: (id: number) =>
                `${SERVER_BACKEND_BASE_URL}/transactions/${id}`,
        },
    },
} as const
