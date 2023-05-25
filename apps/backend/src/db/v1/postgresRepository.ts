import { getLogger, Logger } from 'logger'
import { type Client } from 'pg'
import { TransactionCategory } from 'domain-model'

import PostgresClient from '.'
import { Repository } from '../repository'

export class PostgresRepository implements Repository {
    logger: Logger
    client: Client
    isConnected: boolean

    constructor() {
        this.logger = getLogger('db')
        this.client = PostgresClient
        this.isConnected = false
    }

    initialize = async (): Promise<void> => {
        try {
            await this.client.connect()
            this.isConnected = true
            this.logger.debug(
                `Successfully initialized a ${process.env.NODE_ENV} database connection`
            )
        } catch (err) {
            this.logger.error(
                err,
                `Could not initialize a ${process.env.NODE_ENV} database connection`
            )
            throw err
        }
    }

    close = async (): Promise<void> => {
        try {
            this.logger.debug('Closing the database connection')
            await this.client.end()
            this.logger.debug('Successfully closed the database connection')
        } catch (err) {
            this.logger.error(err, 'Error while the database connection')
        }
    }

    ping = (): boolean => {
        return this.isConnected
    }

    // Utility data
    getTransactionCategories = async (): Promise<TransactionCategory[]> => {
        const query = {
            text: 'SELECT * FROM utils.expense_types UNION SELECT * FROM utils.income_types',
        }
        const queryResult = await this.client.query(query)
        const transactionCategories = queryResult.rows.map((row) => {
            return { category: row.type, description: row.description }
        })
        return transactionCategories
    }

    getTaxCategories = (): Promise<string[]> => {
        //TODO: #8: load data from a DB
        return new Promise((resolve) => {
            resolve([
                'EINKOMMENSTEUER',
                'VERMIETUNG_UND_VERPACHTUNG',
                'WERBUNGSKOSTEN',
                'AUSSERORDENTLICHE_BELASTUNGEN',
            ])
        })
    }

    getPaymentMethods = (): Promise<string[]> => {
        //TODO: #8: load data from a DB
        return new Promise((resolve) => {
            resolve([
                'EC',
                'TRANSFER',
                'PAYPAL',
                'CASH',
                'DIRECT_DEBIT',
                'SEPA',
            ])
        })
    }

    getBankAccounts = (): Promise<string[]> => {
        //TODO: #8: load data from a DB
        return new Promise((resolve) => {
            resolve([
                'KSKWN',
                'CoBa Premium',
                'CoBa Business',
                'VoBa Invest',
                'CASH',
            ])
        })
    }
}
