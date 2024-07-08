import {
    PaginationOptions,
    TransactionContext,
    TransactionType,
} from 'domain-model'
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

const _withPagination = (
    endpoint: string,
    paginationOptions?: Partial<PaginationOptions>
): string => {
    if (!paginationOptions) return endpoint

    const { page, forceFetchAll } = paginationOptions

    if (forceFetchAll) return `${endpoint}?forceFetchAll=true`

    return `${endpoint}?page=${page}`
}

export const PAGES = {
    home: '/',
    admin: {
        blueprints: '/#',
    },
    analysis: {
        cashflow: '/analysis/cashflow',
        charts: '/analysis/charts',
    },
    transactions: {
        index: '/transactions',
        new: '/transactions/new',
        search: '/transactions/search',
        success: (type: TransactionType) => `/transactions/congrats/${type}`,
        edit: (id: number) => `/transactions/${id}`,
    },
} as const

export const API = {
    client: {
        transactions: {
            create: _getClientsideUrl(`/transactions`),
            update: _getClientsideUrl(`/transactions`),
            get: (context: TransactionContext) =>
                _getClientsideUrl(`/transactions?context=${context}`),
            delete: (id: number) => _getClientsideUrl(`/transactions/${id}`),
            search: (paginationOptions?: Partial<PaginationOptions>) =>
                _withPagination(
                    _getClientsideUrl(`/transactions/search`),
                    paginationOptions
                ),
            receipts: {
                getNameOf: (id: number) =>
                    _getClientsideUrl(`/transactions/receipts/${id}/name`),
            },
            constants: {
                getCategories: _getClientsideUrl(
                    '/utils/transactionCategories'
                ),
            },
        },
        analysis: {
            aggregation: _getClientsideUrl(`/analysis/aggregation`),
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
