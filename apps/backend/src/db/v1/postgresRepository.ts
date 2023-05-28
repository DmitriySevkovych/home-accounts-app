import { getLogger, Logger } from 'logger'
import { type Pool } from 'pg'
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
    isConnected: boolean

    constructor() {
        this.logger = getLogger('db')
        this.connectionPool = connectionPool
        this.isConnected = false
    }

    initialize = async (): Promise<void> => {
        try {
            await this.connectionPool.connect()
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
            await this.connectionPool.end()
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
