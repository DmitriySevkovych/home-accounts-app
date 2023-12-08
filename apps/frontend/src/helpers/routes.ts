import { TransactionContext, TransactionType } from 'domain-model'
import path from 'path'

export const BACKEND_HOST = process.env['BACKEND_HOST']!
export const BACKEND_API_BASE = process.env['BACKEND_API_BASE']!

const _getServersideUrl = (endpoint: string): string => {
    return new URL(
        path.join(BACKEND_API_BASE, endpoint),
        BACKEND_HOST
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
            create: `/transactions`,
            update: `/transactions`,
            get: (context: TransactionContext, limit: number) =>
                `/transactions?context=${context}&limit=${limit}`,
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
