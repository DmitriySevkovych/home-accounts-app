import { Request } from 'express'

import {
    BadEnvironmentVariableError,
    BadQueryParameterInRequestError,
} from './errors'

export type Paginated = {
    endReached: boolean
}

export type PaginationOptions = {
    limit: number
    offset: number
    forceFetchAll?: boolean
}

const _parseQueryParameter = (
    name: string,
    parameter: any
): number | undefined => {
    if (!parameter) return undefined

    const value = parseInt(parameter)
    if (isNaN(value)) {
        // throw an error that should lead to a 4xx response
        throw new BadQueryParameterInRequestError(
            `Expected an integer for query parameter '${name}', but received ${parameter}`
        )
    }
    return value
}

const _parseEnvironmentVariable = (
    name: string,
    defaultValue: number
): number => {
    const envValue = process.env[name]
    if (!envValue) return defaultValue

    const parsedValue = parseInt(envValue)

    if (isNaN(parsedValue)) {
        // throw an error that should lead to a 5xx repsonse
        throw new BadEnvironmentVariableError(
            `Expected the environment variable ${name} to be either unset or a number, but received ${process.env[name]}`
        )
    }
    return parsedValue
}

export const DEFAULT_LIMIT = 200
export const DEFAULT_OFFSET = 0
export const DEFAULT_PAGE_SIZE = 50
export const PAGE_SIZE = _parseEnvironmentVariable(
    'PAGINATION_PAGE_SIZE',
    DEFAULT_PAGE_SIZE
)

export const getPaginationOptionsFromRequest = (
    req: Request
): PaginationOptions => {
    if (!req.query) {
        return {
            limit: _parseEnvironmentVariable('PAGINATION_LIMIT', DEFAULT_LIMIT),
            offset: DEFAULT_OFFSET,
        }
    }

    let limit = _parseQueryParameter('limit', req.query.limit)
    if (limit === undefined) {
        limit = _parseEnvironmentVariable('PAGINATION_LIMIT', DEFAULT_LIMIT)
    }

    const page = _parseQueryParameter('page', req.query.page)
    const forceFetchAll = !!req.query.forceFetchAll

    const paginationOptions: PaginationOptions = {
        limit: limit,
        offset: page && page > 1 ? (page - 1) * PAGE_SIZE : DEFAULT_OFFSET,
        forceFetchAll,
    }

    return paginationOptions
}
