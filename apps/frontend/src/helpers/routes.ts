import { TransactionContext, TransactionType } from 'domain-model'
import path from 'path'

const _getServersideUrl = (endpoint: string): string => {
    return new URL(
        path.join(process.env.NEXT_PUBLIC_BACKEND_API_BASE!, endpoint),
        process.env.BACKEND_HOST!
    ).toString()
}

const _getClientsideUrl = (endpoint: string): string => {
    return new URL(
        path.join(process.env.NEXT_PUBLIC_BACKEND_API_BASE!, endpoint),
        process.env.NEXT_PUBLIC_BACKEND_HOST!
    ).toString()
}

export const PAGES = {
    transactions: {
        index: '/transactions',
        new: '/transactions/new',
        success: (type: TransactionType) => `/transactions/congrats/${type}`,
        edit: (id: number) => `/transactions/${id}`,
    },
} as const

export const API = {
    client: {
        transactions: {
            create: _getClientsideUrl(`/transactions`),
            update: _getClientsideUrl(`/transactions`),
            get: (context: TransactionContext, limit: number) =>
                _getClientsideUrl(
                    `/transactions?context=${context}&limit=${limit}`
                ),
            delete: (id: number) => _getClientsideUrl(`/transactions/${id}`),
        },
    },
    server: {
        system: {
            info: () => _getServersideUrl('/system/info'),
        },
        transactions: {
            constants: () => [
                _getServersideUrl('/utils/constants/transactions'),
                _getServersideUrl('/investments'),
                _getServersideUrl('/work/invoices'),
                _getServersideUrl('/transactions/origins'),
            ],
            getById: (id: number) => _getServersideUrl(`/transactions/${id}`),
        },
    },
} as const
