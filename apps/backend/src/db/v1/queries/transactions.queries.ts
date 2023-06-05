import { Transaction, TransactionDate, createTransaction } from 'domain-model'
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

export const _getTransactionDAOById = async (
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

export const _insertTransactionDAO = async (
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

export const _insertTransactionDetailsDAO = async (
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

/* 
    CRUD methods for domain-model transactions 
*/

export const getTransactionById = async (
    id: number,
    connectionPool: Pool
): Promise<Transaction> => {
    const query = {
        name: 'select-transaction-by-id-using-joins',
        text: `
        SELECT 
            tr.amount, ${TransactionDate.formatDateColumn(
                'tr.date'
            )} as date, tr.currency, tr.exchange_rate, tr.source_bank_account, tr.target_bank_account, tr.agent,
            td.payment_method, td.tax_category, td.comment
        FROM transactions.transactions tr 
        JOIN transactions.transaction_details td ON tr.id = td.transaction_id
        WHERE tr.id = $1;`,
        values: [id],
    }
    const queryResult = await connectionPool.query(query)
    if (queryResult.rowCount === 0) {
        logger.warn(`The database does not hold a transaction with id=${id}.`)
        throw new Error(
            `The database does not hold a transaction with id=${id}.`
        )
    }
    const {
        amount,
        date,
        currency,
        exchange_rate: exchangeRate,
        source_bank_account: sourceBankAccount,
        target_bank_account: targetBankAccount,
        agent,
        payment_method: paymentMethod,
        tax_category: taxCategory,
        comment,
    } = queryResult.rows[0]
    const transaction = createTransaction()
        //.about()
        .withId(id)
        .withDate(TransactionDate.fromDatabase(date))
        .withAmount(parseFloat(amount))
        .withCurrency(currency, parseFloat(exchangeRate))
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withComment(comment)
        .withTaxCategory(taxCategory)
        .withAgent(agent)
        // .withSpecifics
        //.addTags
        .build()

    return transaction
}

export const insertTransaction = async (
    transaction: Transaction,
    connectionPool: Pool
): Promise<number> => {
    const client = await connectionPool.connect()
    try {
        await client.query('BEGIN')

        const id = await _insertTransactionDAO(transaction, client)

        await _insertTransactionDetailsDAO(
            { ...transaction, transaction_id: id },
            client
        )

        await client.query('COMMIT')
        logger.trace(
            `Committed the database transaction for inserting a new domain-model transaction with id=${id}.`
        )
        return id
    } catch (e) {
        await client.query('ROLLBACK')
        logger.trace(
            `Something went wrong while inserting a new domain-model transaction. Database transaction has been rolled back.`
        )
        throw e
    } finally {
        client.release()
    }
}
