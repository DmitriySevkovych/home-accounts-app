import { Transaction, TransactionDate, createTransaction } from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import {
    _insertTransactionDAO,
    _insertTransactionDetailsDAO,
} from './transactions.queries'

type HomeTransactionTable = 'expenses' | 'income'

type HomeDAO = Pick<Transaction, 'category' | 'origin' | 'description'> & {
    transaction_id: number
    table: HomeTransactionTable
}

const logger = getLogger('db')

export const getHomeExpenseById = async (
    id: number,
    connectionPool: Pool
): Promise<Transaction> => {
    return await _getTransactionById(id, 'expenses', connectionPool)
}

export const getHomeIncomeById = async (
    id: number,
    connectionPool: Pool
): Promise<Transaction> => {
    return await _getTransactionById(id, 'income', connectionPool)
}

export const insertTransaction = async (
    transaction: Transaction,
    connectionPool: Pool
): Promise<number> => {
    if (transaction.type().specificTo !== 'home') {
        // TODO throw exception!
    }

    const client: PoolClient = await connectionPool.connect()
    try {
        await client.query('BEGIN')

        const id = await _insertTransactionDAO(transaction, client)

        await _insertTransactionDetailsDAO(
            { ...transaction, transaction_id: id },
            client
        )

        const table =
            transaction.type().cashflow === 'expense' ? 'expenses' : 'income'
        await _insertHomeDAO(
            { ...transaction, transaction_id: id, table },
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

const _getTransactionById = async (
    id: number,
    table: HomeTransactionTable,
    connectionPool: Pool
): Promise<Transaction> => {
    const dateColumn = TransactionDate.formatDateColumn('tr.date')
    const query = {
        name: `select-home-${table}`,
        text: `
        SELECT
            h.type, h.origin, h.description,
            tr.amount, ${dateColumn} as date, tr.currency, tr.exchange_rate, tr.source_bank_account, tr.target_bank_account, tr.agent,
            td.payment_method, td.tax_category, td.comment
        FROM home.${table} h
        JOIN transactions.transactions tr ON h.transaction_id = tr.id
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
        type: category,
        origin,
        description,
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
        .about(category, origin, description)
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

const _insertHomeDAO = async (
    home: HomeDAO,
    client: PoolClient
): Promise<void> => {
    const { table, category: type, origin, description, transaction_id } = home
    const query = {
        name: `insert-into-home.${table}`,
        text: `INSERT INTO home.${table}(type, origin, description, transaction_id) VALUES ($1, $2, $3, $4) RETURNING id;`,
        values: [type, origin, description, transaction_id],
    }
    const queryResult = await client.query(query)
    if (queryResult.rowCount === 0) {
        // TODO throw error
    }
    logger.trace(
        `Inserted a new row in home.${table} with id=${queryResult.rows[0].id} and foreign key transaction_id=${transaction_id}.`
    )
}
