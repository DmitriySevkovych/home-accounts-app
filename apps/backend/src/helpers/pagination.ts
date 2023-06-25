import { Request } from 'express'
import {
    BadEnvironmentVariableError,
    BadQueryParameterInRequestError,
} from './errors'

export type PaginationOptions = {
    limit?: number
    offset?: number
}

export const DEFAULT_PAGE_SIZE = 50

export const getPaginationOptionsFromRequest = (
    req: Request
): PaginationOptions => {
    if (!req.query) return {}

    const limit = _parseQueryParameter('limit', req.query.limit)
    const page = _parseQueryParameter('limit', req.query.page)

    let pageSize = DEFAULT_PAGE_SIZE
    if (process.env['PAGINATION_PAGE_SIZE']) {
        pageSize = parseInt(process.env['PAGINATION_PAGE_SIZE'])

        if (isNaN(pageSize)) {
            // throw an error that should lead to a 5xx repsonse
            throw new BadEnvironmentVariableError(
                `Expected the environment variable PAGINATION_PAGE_SIZE to be either unset or a number, but received ${process.env['PAGINATION_PAGE_SIZE']}`
            )
        }
    }

    const paginationOptions: PaginationOptions = {
        limit: limit,
        offset: page ? page * pageSize : undefined,
    }

    return paginationOptions
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
