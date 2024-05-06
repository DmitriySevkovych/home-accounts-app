import type {
    BankAccount,
    BlueprintKey,
    DateRange,
    Investment,
    Paginated,
    PaginationOptions,
    PaymentMethod,
    ProjectInvoice,
    SearchParameters,
    TaxCategory,
    Transaction,
    TransactionAggregate,
    TransactionBlueprint,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
} from 'domain-model'
import { Logger, getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import connectionPool from '.'
import { Repository } from '../repository'
import * as investmentsQueries from './queries/investments.queries'
import * as tagsQueries from './queries/tags.queries'
import * as transactionAggregationQueries from './queries/transactionAggregation.queries'
import * as transactionSearchQueries from './queries/transactionSearch.queries'
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
            `Initialized a new PostgresRepository object. Environment: '${process.env.APP_ENV}'.`
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

        this.connectionPool.on('error', (err: Error, _client: PoolClient) => {
            this.logger.error(err)
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
                `Database ping. Successfully queried timestamp '${result.rows[0].now}' from ${process.env.APP_ENV} database.`
            )
            return true
        } catch (err) {
            this.logger.error(
                err,
                `Database ping. Querying the ${process.env.APP_ENV} database failed with and error.`
            )
            return false
        }
    }

    // Utility data
    getTransactionCategories = async (): Promise<TransactionCategory[]> => {
        return await transactionsQueries.getTransactionCategories(
            this.connectionPool
        )
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
        const id = await transactionsQueries.insertTransaction(
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
        await transactionsQueries.updateTransaction(
            this.connectionPool,
            transaction,
            transactionReceipt
        )
    }

    deleteTransaction = async (id: number): Promise<void> => {
        const transaction = await transactionsQueries.getTransactionById(
            this.connectionPool,
            id
        )
        this.logger.warn(`Deleting transaction with ${transaction.id}`)
        await transactionsQueries.deleteTransaction(
            this.connectionPool,
            transaction
        )
    }

    getTransactions = async (
        context: TransactionContext,
        paginationOptions: PaginationOptions
    ): Promise<Transaction[]> => {
        return await transactionsQueries.getTransactions(
            this.connectionPool,
            context,
            paginationOptions
        )
    }

    getTransactionById = async (id: number): Promise<Transaction> => {
        const result = await transactionsQueries.getTransactionById(
            this.connectionPool,
            id
        )
        return result
    }

    getTransactionByIds = async (ids: number[]): Promise<Transaction[]> => {
        return await transactionsQueries.getTransactionByIds(
            this.connectionPool,
            ids
        )
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

    getTransactionsAggregates = async (
        timeRange: DateRange
    ): Promise<TransactionAggregate[]> => {
        return await transactionAggregationQueries.getGroupedByDate(
            this.connectionPool,
            timeRange
        )
    }

    searchTransactions = async (
        parameters: SearchParameters,
        paginationOptions: PaginationOptions
    ): Promise<{ transactions: Transaction[] } & Paginated> => {
        const { ids: foundTransactionIds, endReached } =
            await transactionSearchQueries.search(
                this.connectionPool,
                parameters,
                paginationOptions
            )
        return {
            transactions: await this.getTransactionByIds(foundTransactionIds),
            endReached,
        }
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
    getActiveBlueprints = async (): Promise<TransactionBlueprint[]> => {
        return await utilsQueries.getActiveBlueprints(this.connectionPool)
    }

    markBlueprintAsProcessed = async (
        blueprintKey: BlueprintKey,
        dateProcessed: Date
    ): Promise<void> => {
        await utilsQueries.markBlueprintAsProcessed(
            this.connectionPool,
            blueprintKey,
            dateProcessed
        )
    }
}
