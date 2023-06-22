import { Transaction } from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

const logger = getLogger('db')

/* 
    Types 
 */

export type TransactionDAO = Pick<
    Transaction,
    | 'date'
    | 'amount'
    | 'sourceBankAccount'
    | 'targetBankAccount'
    | 'currency'
    | 'exchangeRate'
    | 'agent'
> & { id?: number }

export type TransactionDetailsDAO = Pick<
    Transaction,
    'paymentMethod' | 'taxCategory' | 'comment'
> & { transaction_id: number }

/* 
    'database-specific' CRUD methods 
 */

export const getTransactionDAOById = async (
    id: number,
    connectionPool: Pool
): Promise<TransactionDAO> => {
    const query = {
        name: 'select-from-transactions.transactions-where-id',
        text: 'SELECT * FROM transactions.transactions WHERE id = $1;',
        values: [id],
    }
    const queryResult = await connectionPool.query<TransactionDAO>(query)
    if (queryResult.rowCount === 0) {
        logger.warn(`Found no rows in transactions.transactions with id=${id}.`)
        throw new Error(
            `Found no rows in transactions.transactions with id=${id}.`
        )
    }
    return queryResult.rows[0]
}

export const insertTransactionDAO = async (
    transactionDAO: TransactionDAO,
    client: PoolClient
): Promise<number> => {
    const query = {
        name: 'insert-into-transactions.transactions',
        text: `
        INSERT INTO transactions.transactions(date, amount, source_bank_account, target_bank_account, currency, exchange_rate, agent) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id;`,
        values: [
            transactionDAO.date.toString(),
            transactionDAO.amount,
            transactionDAO.sourceBankAccount,
            transactionDAO.targetBankAccount,
            transactionDAO.currency,
            transactionDAO.exchangeRate,
            transactionDAO.agent,
        ],
    }
    const queryResult = await client.query(query)
    if (queryResult.rowCount === 0) {
        // TODO throw error
    }
    logger.info(
        `Inserted a new row in transactions.transactions with primary key id=${queryResult.rows[0].id}.`
    )
    return queryResult.rows[0].id
}

export const insertTransactionDetailsDAO = async (
    transactionDetailsDAO: TransactionDetailsDAO,
    client: PoolClient
): Promise<void> => {
    const query = {
        name: 'insert-into-transactions.transaction_details',
        text: 'INSERT INTO transactions.transaction_details(payment_method, tax_relevant, tax_category, comment, transaction_id) VALUES ($1, $2, $3, $4, $5);',
        values: [
            transactionDetailsDAO.paymentMethod,
            !!transactionDetailsDAO.taxCategory,
            transactionDetailsDAO.taxCategory,
            transactionDetailsDAO.comment,
            transactionDetailsDAO.transaction_id,
        ],
    }
    const queryResult = await client.query(query)
    if (queryResult.rowCount === 0) {
        // TODO throw error
    }
    logger.trace(
        `Inserted a new row in transactions.transaction_details with foreign key transaction_id=${transactionDetailsDAO.transaction_id}.`
    )
}
