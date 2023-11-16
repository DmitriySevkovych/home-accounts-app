import {
    Investment,
    InvestmentType,
    Transaction,
    TransactionReceipt,
    createTransaction,
    dateFromString,
    formatDateColumn,
} from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

import { NoRecordFoundInDatabaseError } from '../../../helpers/errors'
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

type InvestmentDAO = Pick<
    Transaction,
    'type' | 'category' | 'origin' | 'description' | 'investment'
> & {
    transaction_id: number
}

const logger = getLogger('db')

const INVESTMENTS_SCHEMA = 'investments'

export const getInvestmentTypes = async (
    connectionPool: Pool
): Promise<InvestmentType[]> => {
    const queryResult = await connectionPool.query(
        'SELECT type FROM investments.investment_types'
    )
    return queryResult.rows
}

export const getInvestments = async (
    connectionPool: Pool
): Promise<Investment[]> => {
    const queryResult = await connectionPool.query(
        'SELECT key, description, type, start_date, end_date FROM investments.investments'
    )
    return queryResult.rows.map((row) => ({
        key: row.key,
        type: row.type,
        description: row.description,
        startDate: dateFromString(row.start_date),
        endDate: dateFromString(row.end_date),
    }))
}

export const getTransactions = async (
    connectionPool: Pool,
    paginationOptions: PaginationOptions
): Promise<Transaction[]> => {
    const dateColumn = formatDateColumn('tr.date')

    //TODO extract logic to DB view?
    const query = {
        name: `select-${INVESTMENTS_SCHEMA}-transactions`,
        text: `
            SELECT
                i.id as investment_id, i.type as category, i.origin, i.description, i.investment,
                tr.id, tr.context, tr.amount, ${dateColumn} as date, tr.currency, tr.exchange_rate, tr.source_bank_account, tr.target_bank_account, tr.agent,
                td.payment_method, td.tax_category, td.comment, td.receipt_id
            FROM
            (
                SELECT * FROM ${INVESTMENTS_SCHEMA}.expenses
                UNION ALL
                SELECT * FROM ${INVESTMENTS_SCHEMA}.income
            ) i
            JOIN transactions.transactions tr ON i.transaction_id = tr.id
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
    const dateColumn = formatDateColumn('tr.date')
    const query = {
        name: `select-${INVESTMENTS_SCHEMA}-transaction-by-id`,
        //TODO extract logic to DB view?
        text: `
        SELECT
            i.id as home_id, i.type as category, i.origin, i.description, i.investment,
            tr.id, tr.context, tr.amount, ${dateColumn} as date, tr.currency, tr.exchange_rate, tr.source_bank_account, tr.target_bank_account, tr.agent,
            td.payment_method, td.tax_category, td.comment, td.receipt_id
        FROM
        (
            SELECT * FROM ${INVESTMENTS_SCHEMA}.expenses
            UNION ALL
            SELECT * FROM ${INVESTMENTS_SCHEMA}.income
        ) i
        JOIN transactions.transactions tr ON i.transaction_id = tr.id
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

        const home_id = await _insertInvestmentDAO(
            {
                ...transaction,
                transaction_id,
            },
            client
        )

        for (let i = 0; i < transaction.tags.length; i++) {
            // TODO: replace expense_or_income_id with transaction_id once DB has been adjusted
            const tagDAO: TagDAO = {
                type: transaction.type,
                context: transaction.context,
                tag: transaction.tags[i],
                expense_or_income_id: home_id,
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

const _insertInvestmentDAO = async (
    investmentDAO: InvestmentDAO,
    client: PoolClient
): Promise<number> => {
    const {
        type: cashflow,
        category: type,
        origin,
        description,
        transaction_id,
        investment,
    } = investmentDAO
    const table = cashflow === 'expense' ? 'expenses' : 'income'
    const query = {
        name: `insert-into-${INVESTMENTS_SCHEMA}.${table}`,
        text: `INSERT INTO ${INVESTMENTS_SCHEMA}.${table}(type, origin, description, investment, transaction_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
        values: [type, origin, description, investment, transaction_id],
    }
    const queryResult = await client.query(query)
    const investment_id = queryResult.rows[0].id
    logger.trace(
        `Inserted a new row in ${INVESTMENTS_SCHEMA}.${table} with id=${investment_id} and foreign key transaction_id=${transaction_id}.`
    )
    return investment_id
}

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
// TODO remove connectionPool argument once the issue with the tags is corrected
const _mapToTransaction = async (
    row: any,
    connectionPool: Pool
): Promise<Transaction> => {
    const {
        id,
        investment_id,
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
        investment,
    } = row
    const transactionBuilder = createTransaction()
        .about(category, origin, description)
        .withId(id)
        .withContext(context)
        .withDate(dateFromString(date))
        .withAmount(parseFloat(amount))
        .withType(amount > 0 ? 'income' : 'expense')
        .withCurrency(currency, parseFloat(exchangeRate))
        .withPaymentDetails(paymentMethod, sourceBankAccount, targetBankAccount)
        .withComment(comment)
        .withTaxCategory(taxCategory)
        .withAgent(agent)
        .withInvestment(investment)

    // TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
    // TODO remove differentiation income/expense once DB is adjusted
    // TODO remove this function call from here!!! This is unclean and bad for performance
    const tags = await getTagsByExpenseOrIncomeId(
        investment_id,
        parseFloat(amount) >= 0.0 ? 'income' : 'expense',
        context,
        connectionPool
    )
    transactionBuilder.addTags(tags)
    return transactionBuilder.build()
}
