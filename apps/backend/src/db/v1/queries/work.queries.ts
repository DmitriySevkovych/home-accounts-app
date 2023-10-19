import {
    HomeAppDate,
    ProjectInvoice,
    Transaction,
    TransactionReceipt,
    createTransaction,
} from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import {
    NoRecordFoundInDatabaseError,
    UndefinedOperationError,
} from '../../../helpers/errors'
import { PaginationOptions } from '../../../helpers/pagination'
import {
    TagDAO,
    getTagsByExpenseOrIncomeId,
    insertTagDAO,
} from './tags.queries'
import {
    insertTransactionDAO,
    insertTransactionDetailsDAO,
    insertTransactionReceiptDAO,
} from './transactions.queries'

const WORK_CONTEXT = 'work'
const WORK_SCHEMA = WORK_CONTEXT

type WorkDAO = Pick<
    Transaction,
    'type' | 'category' | 'origin' | 'description'
> & {
    transaction_id: number
}

type WorkExpenseDAO = WorkDAO & Pick<Transaction, 'country' | 'vat'>

type WorkIncomeDAO = WorkDAO & Pick<Transaction, 'invoiceKey'>

const logger = getLogger('db')

export const getProjectInvoices = async (
    connectionPool: Pool
): Promise<ProjectInvoice[]> => {
    const queryResult = await connectionPool.query(`
        SELECT 
            key, date, due_date, project, net_amount, vat, discount, status, comment
        FROM work.project_invoices`)
    return queryResult.rows.map((row) => ({
        key: row.key,
        issuanceDate: HomeAppDate.fromDatabase(row.date),
        dueDate: HomeAppDate.fromDatabase(row.due_date),
        project: row.project,
        netAmount: row.net_amount,
        vat: row.vat,
        discount: row.discount,
        status: row.status,
        comment: row.comment,
    }))
}

export const getTransactions = async (
    connectionPool: Pool,
    paginationOptions: PaginationOptions
): Promise<Transaction[]> => {
    const dateColumn = HomeAppDate.formatDateColumn('tr.date')

    //TODO extract logic to DB view?
    const query = {
        name: `select-${WORK_SCHEMA}-transactions`,
        text: `
            SELECT
                w.id as work_id, w.type as category, w.origin, w.description, w.invoice_key, w.vat, w.country,
                tr.id, tr.amount, ${dateColumn} as date, tr.currency, tr.exchange_rate, tr.source_bank_account, tr.target_bank_account, tr.agent,
                td.payment_method, td.tax_category, td.comment
            FROM
            (
                SELECT id, transaction_id, type, origin, description, country, vat, NULL AS invoice_key FROM ${WORK_SCHEMA}.expenses
                UNION ALL
                SELECT id, transaction_id, type, origin, description, NULL AS country, NULL AS vat, invoice_key FROM ${WORK_SCHEMA}.income
            ) w
            JOIN transactions.transactions tr ON w.transaction_id = tr.id
            JOIN transactions.transaction_details td ON tr.id = td.transaction_id
            ORDER by tr.id desc
            LIMIT $1
            OFFSET $2;`,
        values: [paginationOptions.limit, paginationOptions.offset],
    }
    const queryResult = await connectionPool.query(query)

    // TODO remove connectionPool argument once the issue with the tags is corrected
    const transactionsFromRows = queryResult.rows.map((row) =>
        _mapToTransaction(row, connectionPool)
    )

    // TODO remove Promise.all once the issue with the tags is corrected -> mapping will be synchronous
    return await Promise.all(transactionsFromRows)
}

export const getTransactionById = async (
    connectionPool: Pool,
    id: number
): Promise<Transaction> => {
    const dateColumn = HomeAppDate.formatDateColumn('tr.date')
    const query = {
        name: `select-${WORK_SCHEMA}-transaction-by-id`,
        //TODO extract logic to DB view?
        text: `
        SELECT
            w.id as home_id, w.type as category, w.origin, w.description, w.invoice_key, w.vat, w.country,
            tr.id, tr.amount, ${dateColumn} as date, tr.currency, tr.exchange_rate, tr.source_bank_account, tr.target_bank_account, tr.agent,
            td.payment_method, td.tax_category, td.comment
        FROM
        (
            SELECT id, transaction_id, type, origin, description, country, vat, NULL AS invoice_key FROM ${WORK_SCHEMA}.expenses
            UNION ALL
            SELECT id, transaction_id, type, origin, description, NULL AS country, NULL AS vat, invoice_key FROM ${WORK_SCHEMA}.income
        ) w
        JOIN transactions.transactions tr ON w.transaction_id = tr.id
        JOIN transactions.transaction_details td ON tr.id = td.transaction_id
        WHERE tr.id = $1;`,
        values: [id],
    }
    const queryResult = await connectionPool.query(query)
    if (queryResult.rowCount === 0) {
        logger.warn(`The database does not hold a transaction with id=${id}.`)
        throw new NoRecordFoundInDatabaseError(
            `The database does not hold a transaction with id=${id}.`
        )
    }

    return await _mapToTransaction(queryResult.rows[0], connectionPool)
}

export const insertTransaction = async (
    connectionPool: Pool,
    transaction: Transaction,
    transactionReceipt?: TransactionReceipt
): Promise<number> => {
    const client: PoolClient = await connectionPool.connect()
    try {
        await client.query('BEGIN')

        const transaction_id = await insertTransactionDAO(transaction, client)

        const receipt_id = await insertTransactionReceiptDAO(
            transactionReceipt,
            client
        )

        await insertTransactionDetailsDAO(
            { ...transaction, transaction_id, receipt_id },
            client
        )

        const work_id = await _insertWorkDAO(
            transaction,
            transaction_id,
            client
        )

        for (let i = 0; i < transaction.tags.length; i++) {
            // TODO: replace expense_or_income_id with transaction_id once DB has been adjusted
            const tagDAO: TagDAO = {
                type: transaction.type,
                context: transaction.context,
                tag: transaction.tags[i],
                expense_or_income_id: work_id,
            }
            await insertTagDAO(tagDAO, client)
        }

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

const _insertWorkDAO = async (
    transaction: Transaction,
    transaction_id: number,
    client: PoolClient
): Promise<number> => {
    let handleWorkDAOInsertion
    if (transaction.type === 'expense') {
        handleWorkDAOInsertion = _insertWorkExpenseDAO
    } else if (transaction.type === 'income') {
        handleWorkDAOInsertion = _insertWorkIncomeDAO
    } else {
        throw new UndefinedOperationError(
            "Transaction type should be either 'expense' or 'income'."
        )
    }
    const work_id = await handleWorkDAOInsertion(
        {
            ...transaction,
            transaction_id: transaction_id,
        },
        client
    )
    return work_id
}

const _insertWorkExpenseDAO = async (
    work: WorkExpenseDAO,
    client: PoolClient
): Promise<number> => {
    const {
        category: type,
        origin,
        description,
        transaction_id,
        country,
        vat,
    } = work
    const query = {
        name: `insert-into-${WORK_SCHEMA}.expenses`,
        text: `INSERT INTO ${WORK_SCHEMA}.expenses(type, origin, description, vat, country, transaction_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
        values: [type, origin, description, vat, country, transaction_id],
    }
    const queryResult = await client.query(query)
    const work_id = queryResult.rows[0].id
    logger.trace(
        `Inserted a new row in ${WORK_SCHEMA}.expenses with id=${work_id} and foreign key transaction_id=${transaction_id}.`
    )
    return work_id
}

const _insertWorkIncomeDAO = async (
    work: WorkIncomeDAO,
    client: PoolClient
): Promise<number> => {
    const {
        category: type,
        origin,
        description,
        transaction_id,
        invoiceKey,
    } = work
    const query = {
        name: `insert-into-${WORK_SCHEMA}.income`,
        text: `INSERT INTO ${WORK_SCHEMA}.income(type, origin, description, invoice_key, transaction_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
        values: [type, origin, description, invoiceKey, transaction_id],
    }
    const queryResult = await client.query(query)
    const work_id = queryResult.rows[0].id
    logger.trace(
        `Inserted a new row in ${WORK_SCHEMA}.income with id=${work_id} and foreign key transaction_id=${transaction_id}.`
    )
    return work_id
}

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
// TODO remove connectionPool argument once the issue with the tags is corrected
const _mapToTransaction = async (
    row: any,
    connectionPool: Pool
): Promise<Transaction> => {
    const {
        id,
        work_id,
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
        invoice_key,
        country,
        vat,
    } = row
    const transactionBuilder = createTransaction()
        .about(category, origin, description)
        .withId(id)
        .withContext(WORK_CONTEXT)
        .withDate(HomeAppDate.fromDatabase(date))
        .withAmount(parseFloat(amount))
        .withType(amount > 0 ? 'income' : 'expense')
        .withCurrency(currency, parseFloat(exchangeRate))
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withComment(comment)
        .withTaxCategory(taxCategory)
        .withVAT(parseFloat(vat), country)
        .withInvoice(invoice_key)
        .withAgent(agent)

    // TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
    // TODO remove differentiation income/expense once DB is adjusted
    // TODO remove this function call from here!!! This is unclean and bad for performance
    const tags = await getTagsByExpenseOrIncomeId(
        work_id,
        parseFloat(amount) >= 0.0 ? 'income' : 'expense',
        WORK_CONTEXT,
        connectionPool
    )
    transactionBuilder.addTags(tags)
    return transactionBuilder.build()
}
