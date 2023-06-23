import { TransactionType } from 'domain-model'
import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

const logger = getLogger('db')

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
// TODO: remove cashflow argument once DB has been adjusted
type TagTable = 'tags2expenses' | 'tags2income'

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
// TODO: remove TransactionType argument once DB has been adjusted
// TODO: replace home_id with transaction_id once DB has been adjusted
export type TagDAO = {
    type: TransactionType
    tag: string
    expense_or_income_id: number
}

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
export const insertTagDAO = async (
    tagDAO: TagDAO,
    client: PoolClient
): Promise<void> => {
    // TODO: replace expense_or_income_id with transaction_id once DB has been adjusted
    // TODO: remove TransactionType argument once DB has been adjusted
    const { tag, expense_or_income_id, type } = tagDAO

    // TODO: remove once DB has been adjusted
    const schema = type.specificTo
    // TODO: remove once DB has been adjusted
    const table: TagTable =
        type.cashflow === 'income' ? 'tags2income' : 'tags2expenses'
    // TODO: remove once DB has been adjusted
    const idColumn = `${type.cashflow}_id`

    const query = {
        name: `insert-into-${schema}.${table}`,
        text: `INSERT INTO ${schema}.${table}(tag, ${idColumn}) VALUES ($1, $2);`,
        values: [tag, expense_or_income_id],
    }

    // Create new tag if necessary
    if (!(await tagExists(client, tag))) {
        insertTag(client, tag)
    }
    // Insert tag to transaction mapping
    await client.query(query)
}

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
// TODO: remove type argument once DB has been adjusted
// TODO: replace expense_or_income_id with transaction_id once DB has been adjusted
// TODO: rename function once DB has been adjusted
export const getTagsByExpenseOrIncomeId = async (
    expense_or_income_id: number,
    type: TransactionType,
    connectionPool: Pool
): Promise<string[]> => {
    // TODO: remove once DB has been adjusted
    const schema = type.specificTo
    // TODO: remove once DB has been adjusted
    const table: TagTable =
        type.cashflow === 'income' ? 'tags2income' : 'tags2expenses'
    // TODO: remove once DB has been adjusted
    const idColumn = `${type.cashflow}_id`

    const query = {
        name: `select-${schema}.${table}`,
        text: `SELECT tag from ${schema}.${table} WHERE ${idColumn} = $1;`,
        values: [expense_or_income_id],
    }
    const queryResult = await connectionPool.query(query)
    return queryResult.rowCount > 0
        ? queryResult.rows.map((row) => row.tag)
        : []
}

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
export const tagExists = async (
    dbConnection: Pool | PoolClient,
    tag: string
): Promise<boolean> => {
    // TODO: change schema transactions to once DB has been adjusted
    const query = {
        text: 'SELECT * FROM utils.tags WHERE tag=$1',
        values: [tag],
    }
    const queryResult = await dbConnection.query(query)
    return queryResult.rowCount === 1
}

// TECHNICAL DEBT: persistence of tags in DB needs to be refactored and simplified, cf. GitHub Issue #41
export const insertTag = async (
    dbConnection: Pool | PoolClient,
    tag: string
): Promise<void> => {
    // TODO: change schema transactions to once DB has been adjusted
    const query = {
        text: 'INSERT INTO utils.tags(tag) VALUES ($1)',
        values: [tag],
    }
    await dbConnection.query(query)
    // TODO: change schema transactions to once DB has been adjusted
    logger.trace(`Inserted a new tag '${tag}' in utils.tags`)
}
