import {
    Transaction,
    TransactionContext,
    TransactionReceipt,
} from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import { NoRecordFoundInDatabaseError } from '../../../helpers/errors'

const logger = getLogger('db')

/* 
    Types 
 */

export type TransactionDAO = Pick<
    Transaction,
    | 'context'
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
> & {
    transaction_id: number
    receipt_id?: number
}

type TransactionReceiptDAO = TransactionReceipt

/* 
    'database-specific' CRUD methods 
 */

export const getTransactionContext = async (
    connectionPool: Pool,
    transactionId: number
): Promise<TransactionContext> => {
    const query = {
        name: 'select-context-from-transactions.transactions-where-id',
        text: `
        SELECT context
        FROM transactions.transactions
        WHERE id = $1
        `,
        values: [transactionId],
    }
    const queryResult = await connectionPool.query(query)
    if (queryResult.rowCount === 0) {
        throw new NoRecordFoundInDatabaseError(
            `No transaction with id='${transactionId}' found.`
        )
    }
    return queryResult.rows[0]
}

export const getTransactionOrigins = async (
    connectionPool: Pool
): Promise<string[]> => {
    const query = {
        name: 'select-origins-union-over-all-schemas',
        text: `
        SELECT origin FROM home.expenses 
        UNION 
        SELECT origin FROM home.income
        UNION 
        SELECT origin FROM work.expenses
        UNION 
        SELECT origin FROM work.income
        UNION 
        SELECT origin FROM investments.expenses
        UNION 
        SELECT origin FROM investments.income
        `,
    }
    const queryResult = await connectionPool.query(query)
    return queryResult.rows.map((row) => row.origin)
}

export const getTransactionReceipt = async (
    connectionPool: Pool,
    receiptId: number
): Promise<TransactionReceipt> => {
    const query = {
        name: 'select-from-transactions.transaction_receipts-where-id',
        text: `
        SELECT id, buffer, name, mimetype
        FROM transactions.transaction_receipts
        WHERE id = $1
        `,
        values: [receiptId],
    }
    const queryResult = await connectionPool.query(query)
    if (queryResult.rowCount === 0) {
        throw new NoRecordFoundInDatabaseError(
            `No transaction receipt with receipt_id='${receiptId}' found.`
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
        INSERT INTO transactions.transactions(context, date, amount, source_bank_account, target_bank_account, currency, exchange_rate, agent) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id;`,
        values: [
            transactionDAO.context,
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
        text: 'INSERT INTO transactions.transaction_details(payment_method, tax_relevant, tax_category, comment, transaction_id, receipt_id) VALUES ($1, $2, $3, $4, $5, $6);',
        values: [
            transactionDetailsDAO.paymentMethod,
            !!transactionDetailsDAO.taxCategory,
            transactionDetailsDAO.taxCategory,
            transactionDetailsDAO.comment,
            transactionDetailsDAO.transaction_id,
            transactionDetailsDAO.receipt_id,
        ],
    }
    await client.query(query)
    logger.trace(
        `Inserted a new row in transactions.transaction_details with foreign key transaction_id=${transactionDetailsDAO.transaction_id}.`
    )
}

export const insertTransactionReceiptDAO = async (
    transactionReceipt: TransactionReceiptDAO | undefined,
    client: PoolClient
): Promise<number | undefined> => {
    if (!transactionReceipt) {
        logger.trace(
            'No transaction receipt provided for this transaction. Will return undefined for receipt_id'
        )
        return undefined
    }

    const { name, mimetype, buffer } = transactionReceipt

    const query = {
        name: 'insert-into-transactions.transaction_receipts',
        text: 'INSERT INTO transactions.transaction_receipts(name, mimetype, buffer) VALUES ($1, $2, $3) RETURNING id;',
        values: [name, mimetype, buffer],
    }
    const queryResult = await client.query(query)
    logger.info(
        `Inserted a new row in transactions.transaction_receipts with primary key id=${queryResult.rows[0].id}.`
    )
    return queryResult.rows[0].id
}
