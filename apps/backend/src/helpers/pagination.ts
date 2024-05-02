import { DEFAULT_PAGE_SIZE, PaginationOptions } from 'domain-model'
import { Request } from 'express'

import {
    BadEnvironmentVariableError,
    BadQueryParameterInRequestError,
} from './errors'

const _parseQueryInteger = (name: string, parameter: any): number => {
    if (!parameter) return 0

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

export const PAGE_SIZE = _parseEnvironmentVariable(
    'PAGINATION_PAGE_SIZE',
    DEFAULT_PAGE_SIZE
)

export const getPaginationOptionsFromRequest = (
    req: Request
): PaginationOptions => {
    if (!req.query) {
        return { page: 1 }
    }

    const paginationOptions: PaginationOptions = {
        page: _parseQueryInteger('page', req.query.page),
        forceFetchAll: !!req.query.forceFetchAll,
    }

    return paginationOptions
}

export const getOffset = (options?: PaginationOptions): number => {
    if (!options) return 0

    const { page } = options
    return page > 1 ? (page - 1) * PAGE_SIZE : 0
}

export const getLimitAndOffset = (
    options?: PaginationOptions
): { limit: number; offset: number } => {
    return {
        limit: PAGE_SIZE,
        offset: getOffset(options),
    }
}
