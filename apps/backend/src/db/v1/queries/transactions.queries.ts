import {
    Transaction,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
    createTransaction,
    dateFromString,
} from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import {
    DataConsistencyError,
    NoRecordFoundInDatabaseError,
    UnsupportedTransactionOperationError,
} from '../../../helpers/errors'
import { PaginationOptions } from '../../../helpers/pagination'
import {
    associateTransactionWithInvestment,
    getInvestmentForTransactionId,
} from './investments.queries'
import {
    TagDAO,
    getTagsByTransactionId,
    insertTagDAO,
    updateTransactionTags,
} from './tags.queries'
import {
    associateTransactionWithProjectInvoice,
    getInvoiceKeyForTransactionId,
    getVATForTransactionId,
    insertTransactionVAT,
} from './work.queries'

const logger = getLogger('db')

/*
    'database-specific' CRUD methods
 */
export const getTransactionCategories = async (
    connectionPool: Pool
): Promise<TransactionCategory[]> => {
    const query = {
        text: `SELECT category, context, can_be_expense, can_be_income from transactions.transaction_categories;`,
    }
    const queryResult = await connectionPool.query(query)
    const transactionCategories: TransactionCategory[] = queryResult.rows.map(
        (row) => ({
            category: row.category,
            context: row.context,
            canBeExpense: Boolean(row.can_be_expense),
            canBeIncome: Boolean(row.can_be_income),
        })
    )
    return transactionCategories
}

export const getTransactionOrigins = async (
    connectionPool: Pool
): Promise<string[]> => {
    const query = {
        name: 'select-distinct-origins-from-transactions.transactions',
        text: `SELECT DISTINCT origin FROM transactions.transactions`,
    }
    const queryResult = await connectionPool.query(query)
    return queryResult.rows.map((row) => row.origin)
}

export const getTransactions = async (
    connectionPool: Pool,
    context: TransactionContext,
    paginationOptions: PaginationOptions
): Promise<Transaction[]> => {
    const { limit, offset, forceFetchAll } = paginationOptions
    const paginationValues = forceFetchAll ? [] : [limit, offset]
    //TODO extract logic to DB view?
    const query = {
        name: `select-transactions`,
        text: `
            SELECT
                id, context, category, origin, description, amount, date, currency, exchange_rate, 
                source_bank_account, target_bank_account, payment_method, tax_category, comment, agent, receipt_id
            FROM transactions.transactions
            WHERE context = $1
            ORDER BY id DESC
            ${forceFetchAll ? '' : 'LIMIT $2 OFFSET $3'}
            ;`,
        values: [context, ...paginationValues],
    }
    const queryResult = await connectionPool.query(query)

    const transactionsFromRows = queryResult.rows.map((row) =>
        _mapToTransaction(row, connectionPool)
    )

    return await Promise.all(transactionsFromRows)
}

export const getTransactionByIds = async (
    connectionPool: Pool,
    ids: number[]
): Promise<Transaction[]> => {
    if (ids.length === 0) {
        return Promise.resolve([])
    }

    //TODO extract logic to DB view?
    const query = {
        name: `select-transaction-by-id`,
        text: `
        SELECT
            id, context, category, origin, description, amount, date, currency, exchange_rate, 
            source_bank_account, target_bank_account, payment_method, tax_category, comment, agent, receipt_id
        FROM transactions.transactions
        WHERE id = ANY($1::int[])
        ORDER BY id DESC;`,
        values: [ids],
    }
    const queryResult = await connectionPool.query(query)

    const { rowCount, rows } = queryResult
    if (rowCount === 0) {
        logger.warn(
            `The database does not hold any transactions with id in ${ids}.`
        )
        throw new NoRecordFoundInDatabaseError(
            `The database does not hold a transaction with with id in ${ids}.`
        )
    }

    const transactionsFromRows = rows.map((row) =>
        _mapToTransaction(row, connectionPool)
    )

    return Promise.all(transactionsFromRows)
}

export const getTransactionById = async (
    connectionPool: Pool,
    id: number
): Promise<Transaction> => {
    const transactions = await getTransactionByIds(connectionPool, [id])
    return transactions[0]
}

export const insertTransaction = async (
    connectionPool: Pool,
    transaction: Transaction,
    transactionReceipt?: TransactionReceipt
): Promise<number> => {
    const client: PoolClient = await connectionPool.connect()
    try {
        await client.query('BEGIN')

        const receiptId = await _insertTransactionReceiptDAO(
            transactionReceipt,
            client
        )

        const transaction_id = await _insertTransactionDAO(
            {
                ...transaction,
                receiptId,
            },
            client
        )

        for (let i = 0; i < transaction.tags.length; i++) {
            const tagDAO: TagDAO = {
                tag: transaction.tags[i],
                transaction_id,
            }
            await insertTagDAO(tagDAO, client)
        }

        await _upsertContextSpecificInformation(
            transaction_id,
            transaction,
            client
        )

        await client.query('COMMIT')
        logger.trace(
            `Committed the database transaction for inserting a new domain-model transaction with id=${transaction_id}.`
        )
        return transaction_id
    } catch (e) {
        await client.query('ROLLBACK')
        logger.warn(
            `Something went wrong while inserting a new domain-model transaction. Database transaction has been rolled back.`
        )
        throw e
    } finally {
        client.release()
    }
}

export const updateTransaction = async (
    connectionPool: Pool,
    transaction: Transaction,
    transactionReceipt?: TransactionReceipt
): Promise<void> => {
    const { id } = transaction
    if (id === undefined) {
        const message = `Cannot update transaction: transaction.id is missing!`
        logger.warn(message)
        throw new DataConsistencyError(message)
    }

    const client: PoolClient = await connectionPool.connect()
    try {
        await client.query('BEGIN')
        // Update transaction receipt table
        const receiptId = await _updateTransactionReceiptDAO(
            {
                ...transactionReceipt,
                id: transaction.receiptId,
            },
            client
        )

        // Update transaction table
        await _updateTransactionDAO(
            {
                ...transaction,
                receiptId,
            },
            client
        )

        // Update tags
        await updateTransactionTags(
            {
                ...transaction,
                transaction_id: id,
            },
            client
        )

        await _upsertContextSpecificInformation(id, transaction, client)

        await client.query('COMMIT')
        logger.trace(
            `Domain-model transaction with transaction_id=${id} has been updated.`
        )
    } catch (e) {
        await client.query('ROLLBACK')
        logger.warn(
            `Something went wrong while updating the domain-model transaction with transaction_id=${id}. Database transaction has been rolled back.`
        )
        throw e
    } finally {
        client.release()
    }
}

export const deleteTransaction = async (
    connectionPool: Pool,
    transaction: Transaction
): Promise<void> => {
    const { id } = transaction
    if (id === undefined) {
        const message = `Cannot delete transaction: transaction.id is missing!`
        logger.warn(message)
        throw new DataConsistencyError(message)
    }

    // Do not delete work project invoice information. This is intended!
    if (
        transaction.context === 'investments' &&
        transaction.type === 'income'
    ) {
        throw new UnsupportedTransactionOperationError(
            'Deleting work income transactions is dangerous and can mess up project invoice information. Will not delete...'
        )
    }

    const client: PoolClient = await connectionPool.connect()
    try {
        await client.query('BEGIN')

        await _deleteTransactionReceiptDAO(transaction.receiptId, client)

        await _deleteTransactionDAO(id, client)
        // Deleting transaction tags is handled by DB cascade
        // Deleting investment associations is handled by DB cascade
        // Deleting work vat information is handled by DB cascade

        await client.query('COMMIT')
        logger.trace(
            `Domain-model transaction with transaction_id=${id} has been updated.`
        )
    } catch (e) {
        await client.query('ROLLBACK')
        logger.warn(
            `Something went wrong while updating the domain-model transaction with transaction_id=${id}. Database transaction has been rolled back.`
        )
        throw e
    } finally {
        client.release()
    }
}

export const getTransactionReceipt = async (
    connection: Pool | PoolClient,
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
    const queryResult = await connection.query(query)
    if (queryResult.rowCount === 0) {
        throw new NoRecordFoundInDatabaseError(
            `No transaction receipt with receipt_id='${receiptId}' found.`
        )
    }
    return queryResult.rows[0]
}

/* 
    Private helper methods 
*/

/* Transaction DAO */
const _insertTransactionDAO = async (
    transaction: Transaction,
    client: PoolClient
): Promise<number> => {
    const query = {
        name: 'insert-into-transactions.transactions',
        text: `
        INSERT INTO transactions.transactions(context, category, origin, description, date, amount, source_bank_account, target_bank_account, currency, exchange_rate, payment_method, tax_category, comment, agent, receipt_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id;`,
        values: [
            transaction.context,
            transaction.category,
            transaction.origin,
            transaction.description,
            transaction.date.toISOString(),
            transaction.amount,
            transaction.sourceBankAccount,
            transaction.targetBankAccount,
            transaction.currency,
            transaction.exchangeRate,
            transaction.paymentMethod,
            transaction.taxCategory,
            transaction.comment,
            transaction.agent,
            transaction.receiptId,
        ],
    }
    const queryResult = await client.query(query)
    logger.info(
        `Inserted a new row in transactions.transactions with primary key id=${queryResult.rows[0].id}.`
    )
    return queryResult.rows[0].id
}

const _updateTransactionDAO = async (
    transaction: Transaction,
    client: PoolClient
): Promise<void> => {
    const query = {
        name: 'update-transactions.transactions',
        text: `
        UPDATE transactions.transactions 
        SET 
            context=$1, category=$2, origin=$3, description=$4, date=$5, amount=$6, source_bank_account=$7, target_bank_account=$8, 
            currency=$9, exchange_rate=$10, payment_method=$11, tax_category=$12, comment=$13, agent=$14, receipt_id=$15
        WHERE id=$16;`,
        values: [
            transaction.context,
            transaction.category,
            transaction.origin,
            transaction.description,
            transaction.date.toISOString(),
            transaction.amount,
            transaction.sourceBankAccount,
            transaction.targetBankAccount,
            transaction.currency,
            transaction.exchangeRate,
            transaction.paymentMethod,
            transaction.taxCategory,
            transaction.comment,
            transaction.agent,
            transaction.receiptId,
            transaction.id,
        ],
    }
    await client.query(query)
    logger.trace(
        `Updated row with id=${transaction.id} in transactions.transactions.`
    )
}

const _deleteTransactionDAO = async (
    id: number,
    client: PoolClient
): Promise<void> => {
    const query = {
        name: 'delete-from-transactions.transactions',
        text: `DELETE FROM transactions.transactions WHERE id=$1;`,
        values: [id],
    }
    await client.query(query)
}

/* Transaction Receipt DAO */
const _insertTransactionReceiptDAO = async (
    transactionReceipt: TransactionReceipt | undefined,
    client: PoolClient
): Promise<number | undefined> => {
    if (
        !transactionReceipt ||
        !(
            transactionReceipt.buffer &&
            transactionReceipt.mimetype &&
            transactionReceipt.name
        )
    ) {
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

const _updateTransactionReceiptDAO = async (
    transactionReceipt: Partial<TransactionReceipt>,
    client: PoolClient
): Promise<number | undefined> => {
    if (!transactionReceipt.id) {
        // If no transaction receipt is yet present in the database, handle insert
        return await _insertTransactionReceiptDAO(
            transactionReceipt as TransactionReceipt,
            client
        )
    }

    // Check if old receipt is present
    logger.trace(
        `The transaction has the property receipt_id=${transactionReceipt.id}. Will query the database for this receipt.`
    )
    const oldReceipt = await getTransactionReceipt(
        client,
        transactionReceipt.id
    )
    logger.trace(
        `Found a receipt ${oldReceipt.name} with receipt_id=${transactionReceipt.id}.`
    )

    if (!transactionReceipt?.buffer) {
        logger.trace(
            'No new transaction receipt provided for this transaction.'
        )
        return oldReceipt.id
    }

    // Update receipt
    const { name, mimetype, buffer, id } = transactionReceipt

    const query = {
        name: 'update-transactions.transaction_receipts',
        text: 'UPDATE transactions.transaction_receipts SET name=$1, mimetype=$2, buffer=$3 WHERE id=$4;',
        values: [name, mimetype, buffer, id],
    }
    await client.query(query)
    logger.info(
        `Updated row in transactions.transaction_receipts with id=${id}.`
    )
    return id
}

const _deleteTransactionReceiptDAO = async (
    receiptId: number | undefined,
    client: PoolClient
): Promise<void> => {
    if (!receiptId) {
        logger.trace('No receiptId given, nothing to delete.')
        return
    }

    const query = {
        name: 'delete-from-transactions.transaction_receipts',
        text: 'DELETE FROM transactions.transaction_receipts WHERE id=$1;',
        values: [receiptId],
    }
    await client.query(query)
}

/* Transaction-related data specific to transaction context */

const _upsertContextSpecificInformation = async (
    transaction_id: number,
    transaction: Transaction,
    client: PoolClient
) => {
    if (transaction.context === 'investments') {
        await associateTransactionWithInvestment(
            transaction_id,
            transaction.investment!,
            client
        )
    } else if (transaction.context === 'work') {
        if (transaction.type === 'expense') {
            await insertTransactionVAT(
                {
                    id: transaction_id,
                    vat: transaction.vat!,
                    country: transaction.country!,
                },
                client
            )
        } else if (transaction.type === 'income') {
            await associateTransactionWithProjectInvoice(
                transaction_id,
                transaction.invoiceKey!,
                client
            )
        } else {
            throw new Error(`Unknown transaction type ${transaction.type}`)
        }
    }
}

/* Other */
const _mapToTransaction = async (
    row: any,
    connectionPool: Pool
): Promise<Transaction> => {
    const {
        id,
        context,
        category,
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
        receipt_id: receiptId,
    } = row

    const transactionType = amount > 0 ? 'income' : 'expense'

    const transactionBuilder = createTransaction()
        .about(category, origin, description)
        .withId(id)
        .withContext(context)
        .withDate(dateFromString(date))
        .withAmount(parseFloat(amount))
        .withType(transactionType)
        .withCurrency(currency, parseFloat(exchangeRate))
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withComment(comment)
        .withTaxCategory(taxCategory)
        .withReceipt(receiptId)
        .withAgent(agent)

    // TODO maybe remove these function calls from here and work with joins, if feasible
    // TODO remove connectionPool argument if the above TODO is done
    const tags = await getTagsByTransactionId(id, connectionPool)
    transactionBuilder.addTags(tags)

    if (context === 'investments') {
        const investment = await getInvestmentForTransactionId(
            id,
            connectionPool
        )
        transactionBuilder.withInvestment(investment)
    } else if (context === 'work') {
        if (transactionType === 'expense') {
            const { vat, country } = await getVATForTransactionId(
                id,
                connectionPool
            )
            transactionBuilder.withVAT(vat, country)
        } else if (transactionType === 'income') {
            const invoiceKey = await getInvoiceKeyForTransactionId(
                id,
                connectionPool
            )
            transactionBuilder.withInvoice(invoiceKey)
        }
    }
    return transactionBuilder.build()
}
