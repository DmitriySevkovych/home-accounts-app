import { getLogger, Logger } from 'logger'
import type { PoolClient, Pool } from 'pg'
import type {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    Transaction,
    TransactionCategory,
} from 'domain-model'

import connectionPool from '.'
import * as utilsQueries from './queries/utils.queries'
import { Repository } from '../repository'

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

    createTransaction = (transaction: Transaction) => {
        this.logger.info(transaction)
        return true
    }
}
