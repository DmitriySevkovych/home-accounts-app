import type {
    BankAccount,
    Investment,
    PaymentMethod,
    ProjectInvoice,
    TaxCategory,
    Transaction,
    TransactionCategory,
    TransactionReceipt,
} from 'domain-model'
import { Logger, getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import connectionPool from '.'
import { UnsupportedTransactionContextError } from '../../helpers/errors'
import { PaginationOptions } from '../../helpers/pagination'
import { Repository } from '../repository'
import * as homeQueries from './queries/home.queries'
import * as investmentsQueries from './queries/investments.queries'
import * as tagsQueries from './queries/tags.queries'
import * as utilsQueries from './queries/utils.queries'
import * as workQueries from './queries/work.queries'

export class PostgresRepository implements Repository {
    logger: Logger
    connectionPool: Pool

    constructor() {
        this.logger = getLogger('db')
        this.connectionPool = connectionPool
        this.initialize()
        this.logger.debug(
            `Initialized a new PostgresRepository object. Environment: '${process.env.NODE_ENV}'.`
        )
    }

    initialize = () => {
        this.connectionPool.on('connect', (_client: PoolClient) => {
            const { totalCount } = this.connectionPool
            this.logger.debug(
                `Connection pool created a new connected client. Current pool size: ${totalCount}.`
            )
        })

        this.connectionPool.on('acquire', (_client: PoolClient) => {
            const { totalCount, idleCount } = this.connectionPool
            this.logger.trace(
                `A client has been checked out from the pool. Current pool size: ${totalCount}. Currently idle clients: ${idleCount}.`
            )
        })
    }

    close = async (): Promise<void> => {
        try {
            this.logger.debug('Ending all database connection clients.')
            await this.connectionPool.end()
            this.logger.debug(
                'Successfully ended all database connection clients.'
            )
        } catch (err) {
            this.logger.error(
                err,
                'Error while ending the database connection clients.'
            )
        }
    }

    ping = async (): Promise<boolean> => {
        try {
            this.logger.debug('Database ping.')
            const result = await this.connectionPool.query(
                'SELECT NOW() as now'
            )
            this.logger.debug(
                `Database ping. Successfully queried timestamp '${result.rows[0].now}' from ${process.env.NODE_ENV} database.`
            )
            return true
        } catch (err) {
            this.logger.error(
                err,
                `Database ping. Querying the ${process.env.NODE_ENV} database failed with and error.`
            )
            return false
        }
    }

    // Utility data
    getTransactionCategories = async (): Promise<TransactionCategory[]> => {
        return await utilsQueries.getTransactionCategories(this.connectionPool)
    }

    getTaxCategories = async (): Promise<TaxCategory[]> => {
        return await utilsQueries.getTaxCategories(this.connectionPool)
    }

    getPaymentMethods = async (): Promise<PaymentMethod[]> => {
        return await utilsQueries.getPaymentMethods(this.connectionPool)
    }

    getBankAccounts = async (): Promise<BankAccount[]> => {
        return await utilsQueries.getBankAccounts(this.connectionPool)
    }

    getTags = async (): Promise<string[]> => {
        return await tagsQueries.getTags(this.connectionPool)
    }

    // Transactions
    createTransaction = async (
        transaction: Transaction,
        transactionReceipt?: TransactionReceipt
    ): Promise<number> => {
        // TODO to log or not to log?
        this.logger.info(transaction)
        let queries
        switch (transaction.context) {
            case 'home':
                queries = homeQueries
                break
            case 'investments':
                queries = investmentsQueries
                break
            case 'work':
                queries = workQueries
                break
            default:
                throw new UnsupportedTransactionContextError(
                    `Transaction context '${transaction.context}' is unsupported in DB v1.`
                )
        }
        const id = await queries.insertTransaction(
            this.connectionPool,
            transaction,
            transactionReceipt
        )
        return id
    }

    getTransactions = async (
        paginationOptions: PaginationOptions
    ): Promise<Transaction[]> => {
        return await homeQueries.getTransactions(
            this.connectionPool,
            paginationOptions
        )
    }

    getTransactionById = async (id: number): Promise<Transaction> => {
        return await homeQueries.getTransactionById(this.connectionPool, id)
    }

    // Investments
    getInvestments = async (): Promise<Investment[]> => {
        return await investmentsQueries.getInvestments(this.connectionPool)
    }

    // Work
    getProjectInvoices = async (): Promise<ProjectInvoice[]> => {
        return await workQueries.getProjectInvoices(this.connectionPool)
    }
}
