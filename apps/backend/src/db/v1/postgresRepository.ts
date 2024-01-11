import type {
    BankAccount,
    Investment,
    PaymentMethod,
    ProjectInvoice,
    TaxCategory,
    Transaction,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
} from 'domain-model'
import { Logger, getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import connectionPool from '.'
import { ProcessedBlueprintResult } from '../../definitions/processes'
import { UnsupportedTransactionContextError } from '../../helpers/errors'
import { PaginationOptions } from '../../helpers/pagination'
import { Repository } from '../repository'
import * as homeQueries from './queries/home.queries'
import * as investmentsQueries from './queries/investments.queries'
import * as tagsQueries from './queries/tags.queries'
import * as transactionsQueries from './queries/transactions.queries'
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
            `Initialized a new PostgresRepository object. Environment: '${process.env['APP_ENV']}'.`
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

        this.connectionPool.on(
            'release',
            (_err: Error, _client: PoolClient) => {
                const { totalCount, idleCount } = this.connectionPool
                this.logger.trace(
                    `A client has been released. Current pool size: ${totalCount}. Currently idle clients: ${idleCount}.`
                )
            }
        )
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
                `Database ping. Successfully queried timestamp '${result.rows[0].now}' from ${process.env['APP_ENV']} database.`
            )
            return true
        } catch (err) {
            this.logger.error(
                err,
                `Database ping. Querying the ${process.env['APP_ENV']} database failed with and error.`
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
        const queries = this._queries(transaction.context)
        const id = await queries.insertTransaction(
            this.connectionPool,
            transaction,
            transactionReceipt
        )
        return id
    }

    updateTransaction = async (
        transaction: Transaction,
        transactionReceipt?: TransactionReceipt
    ): Promise<void> => {
        // TODO to log or not to log?
        this.logger.info(transaction)
        const queries = this._queries(transaction.context)
        await queries.updateTransaction(
            this.connectionPool,
            transaction,
            transactionReceipt
        )
    }

    getTransactions = async (
        context: TransactionContext,
        paginationOptions: PaginationOptions
    ): Promise<Transaction[]> => {
        const queries = this._queries(context)
        return await queries.getTransactions(
            this.connectionPool,
            paginationOptions
        )
    }

    getTransactionById = async (id: number): Promise<Transaction> => {
        // TECHNICAL DEBT - the extra step for determining the context is made due to the suboptimal database design.
        // There is some ugly redundancy here...
        // TODO Fix in v2...
        const context = await transactionsQueries.getTransactionContext(
            this.connectionPool,
            id
        )
        const queries = this._queries(context)
        return await queries.getTransactionById(this.connectionPool, id)
    }

    getTransactionReceipt = async (
        receiptId: number
    ): Promise<TransactionReceipt> => {
        return await transactionsQueries.getTransactionReceipt(
            this.connectionPool,
            receiptId
        )
    }

    getTransactionOrigins = async (): Promise<string[]> => {
        return await transactionsQueries.getTransactionOrigins(
            this.connectionPool
        )
    }

    // Investments
    getInvestments = async (): Promise<Investment[]> => {
        return await investmentsQueries.getInvestments(this.connectionPool)
    }

    // Work
    getProjectInvoices = async (): Promise<ProjectInvoice[]> => {
        return await workQueries.getProjectInvoices(this.connectionPool)
    }

    // Blueprints
    processBlueprints = async (): Promise<ProcessedBlueprintResult[]> => {
        // const activeBlueprints = await utilsQueries.getActiveBlueprints(this.connectionPool)

        // const progress = []
        // for (let i = 0; i < activeBlueprints.length; i++) {
        //     const status = await processBlueprint(this.connectionPool, activeBlueprints[i])
        //     progress.push(status)
        // }

        return []
    }

    /*
        Private helper methods
    */
    _queries = (context: TransactionContext) => {
        switch (context) {
            case 'home':
                return homeQueries
            case 'investments':
                return investmentsQueries
            case 'work':
                return workQueries
            default:
                throw new UnsupportedTransactionContextError(
                    `Transaction context '${context}' is unsupported in DB v1.`
                )
        }
    }
}
