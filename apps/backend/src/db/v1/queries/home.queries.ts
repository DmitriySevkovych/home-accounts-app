import { Transaction, TransactionDate, createTransaction } from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import {
    _insertTransactionDAO,
    _insertTransactionDetailsDAO,
} from './transactions.queries'

const logger = getLogger('db')

export const getTransactionById = async (
    id: number,
    connectionPool: Pool
): Promise<Transaction> => {
    const dateColumn = TransactionDate.formatDateColumn('tr.date')
    const query = {
        name: 'select-transaction-by-id-using-joins',
        text: `
        SELECT 
            tr.amount, ${dateColumn} as date, tr.currency, tr.exchange_rate, tr.source_bank_account, tr.target_bank_account, tr.agent,
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
    const client: PoolClient = await connectionPool.connect()
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
