import { PaginationOptions, type TransactionContext } from 'domain-model'
import { Request } from 'express'

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
