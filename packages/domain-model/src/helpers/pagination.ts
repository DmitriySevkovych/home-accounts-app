export type Paginated = {
    endReached: boolean
}

export type PaginationOptions = {
    limit: number
    offset: number
    forceFetchAll?: boolean
}

export const DEFAULT_LIMIT = 200
export const DEFAULT_OFFSET = 0
export const DEFAULT_PAGE_SIZE = 50
