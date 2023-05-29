import { getLogger, Logger } from 'logger'
import type { PoolClient, Pool } from 'pg'
import type {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'

import connectionPool from '.'
import { Repository } from '../repository'

export class PostgresRepository implements Repository {
    logger: Logger
    connectionPool: Pool

    constructor() {
        this.logger = getLogger('db')
        this.connectionPool = connectionPool
        // this.initialize()
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
            this.logger.debug(
                `A client has been checked out from the pool. Current pool size: ${totalCount}. Currently idle clients: ${idleCount}.`
            )
        })
    }

    close = async (): Promise<void> => {
        try {
            this.logger.debug('Ending all database connection clients')
            await this.connectionPool.end()
            this.logger.debug(
                'Successfully ended all database connection clients'
            )
        } catch (err) {
            this.logger.error(
                err,
                'Error while ending the database connection clients'
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
        const query = {
            text: 'SELECT type, description FROM utils.expense_types UNION SELECT type, description FROM utils.income_types',
        }
        const queryResult = await this.connectionPool.query(query)
        const transactionCategories: TransactionCategory[] =
            queryResult.rows.map((row) => ({
                category: row.type,
                description: row.description,
            }))
        return transactionCategories
    }

    getTaxCategories = async (): Promise<TaxCategory[]> => {
        const queryResult = await this.connectionPool.query(
            'SELECT category, description FROM utils.tax_categories'
        )
        const taxCategories: TaxCategory[] = queryResult.rows.map((row) => ({
            category: row.category,
            description: row.description,
        }))
        return taxCategories
    }

    getPaymentMethods = async (): Promise<PaymentMethod[]> => {
        const queryResult = await this.connectionPool.query(
            'SELECT name, description FROM utils.payment_methods'
        )
        const paymentMethods: PaymentMethod[] = queryResult.rows.map((row) => ({
            method: row.name,
            description: row.description,
        }))
        return paymentMethods
    }

    getBankAccounts = async (): Promise<BankAccount[]> => {
        const queryResult = await this.connectionPool.query(
            'SELECT* FROM utils.bank_accounts'
        )
        const bankAccounts: BankAccount[] = queryResult.rows.map((row) => ({
            account: row.account,
            bank: row.bank,
            annualFee: row.annual_fee,
            category: row.type,
            owner: row.owner,
            iban: row.iban,
            purpose: row.purpose,
            openingDate: row.opening_date,
            closingDate: row.closing_date,
            contact: row.contact,
            comment: row.comment,
        }))
        return bankAccounts
    }
}
