import { type TransactionContext } from 'domain-model'
import { Request } from 'express'

import { PaginationOptions } from '../helpers/pagination'

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
