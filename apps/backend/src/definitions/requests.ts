import { PaginationOptions, type TransactionContext } from 'domain-model'
import { Request, Response } from 'express'
import { Query, Send } from 'express-serve-static-core'

// From https://plainenglish.io/blog/typed-express-request-and-response-with-typescript
export interface TypedRequestQuery<T extends Query> extends Request {
    query: T
}

export interface TypedRequestBody<T> extends Request {
    body: T
}

export interface TypedRequest<T extends Query, U> extends Request {
    body: U
    query: T
}

export interface TypedResponse<ResBody> extends Response {
    json: Send<ResBody, this>
}

// Custom stuff, mostly for middleware
export interface RequestWithTransactionContext extends Request {
    transactionContext?: TransactionContext
}

export interface RequestWithPagination extends Request {
    paginationOptions?: PaginationOptions
}

export interface GetTransactionsRequest
    extends RequestWithTransactionContext,
        RequestWithPagination {}

export interface GetTransactionSearchRequest extends RequestWithPagination {}
