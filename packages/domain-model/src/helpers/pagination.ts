export type Paginated = {
    endReached: boolean
}

export type PaginationOptions = {
    page: number
    forceFetchAll?: boolean
}

export const DEFAULT_PAGE_SIZE = 25
