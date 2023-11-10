export const PAGES = {
    transactions: {
        index: '/transactions',
        new: '/transactions/new',
        success: '/transactions/congrats',
        edit: (id: number) => `/transactions/${id}`,
    },
} as const
