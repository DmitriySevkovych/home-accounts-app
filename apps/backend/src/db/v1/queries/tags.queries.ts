import { getLogger } from 'logger'
import type { Pool, PoolClient } from 'pg'

const logger = getLogger('db')

export type TagDAO = {
    tag: string
    transaction_id: number
}

export type TransactionTagsBatchDAO = {
    tags: string[]
    transaction_id: number
}

export const insertTagDAO = async (
    tagDAO: TagDAO,
    client: PoolClient
): Promise<void> => {
    const { tag, transaction_id } = tagDAO

    const query = {
        name: `insert-into-transactions.transaction_tags`,
        text: `INSERT INTO transactions.transaction_tags(tag, transaction_id) VALUES ($1, $2);`,
        values: [tag, transaction_id],
    }

    // Create new tag if necessary
    if (!(await tagExists(client, tag))) {
        insertTag(client, tag)
    }
    // Insert tag to transaction mapping
    await client.query(query)
}

export const updateTransactionTags = async (
    transactionTagsDAO: TransactionTagsBatchDAO,
    client: PoolClient
): Promise<void> => {
    const { tags, transaction_id } = transactionTagsDAO
    // Create a 'tag diff' (in-flight transaction tags vs already stored tags)
    const storedTags = await getTagsByTransactionId(transaction_id, client)

    const newTags = tags.filter((tag) => !storedTags.includes(tag))
    const obsoleteTags = storedTags.filter((tag) => !tags.includes(tag))

    // Insert new transaction tags into DB // TODO batch inserts!
    newTags.forEach((tag) =>
        insertTagDAO(
            {
                tag,
                transaction_id,
            },
            client
        )
    )

    // Delete obsolete transaction tags from DB // TODO batch deletes with something like WHERE tags IN(...)
    obsoleteTags.forEach((tag) =>
        _untag(
            {
                tag,
                transaction_id,
            },
            client
        )
    )
}

const _untag = async (tagDAO: TagDAO, client: PoolClient): Promise<void> => {
    const { tag, transaction_id } = tagDAO
    const query = {
        name: `delet-from-transactions.transaction_tags`,
        text: `DELETE FROM transactions.transaction_tags WHERE tag=$1 AND transaction_id=$2;`,
        values: [tag, transaction_id],
    }
    await client.query(query)
}

export const getTagsByTransactionId = async (
    transaction_id: number,
    dbConnection: Pool | PoolClient
): Promise<string[]> => {
    const query = {
        name: `select-transactions.transaction_tags`,
        text: `SELECT tag FROM transactions.transaction_tags WHERE transaction_id = $1;`,
        values: [transaction_id],
    }
    const queryResult = await dbConnection.query(query)
    return queryResult.rowCount > 0
        ? queryResult.rows.map((row) => row.tag)
        : []
}

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

export const getTags = async (connectionPool: Pool): Promise<string[]> => {
    const queryResult = await connectionPool.query('SELECT tag FROM utils.tags')
    return queryResult.rows.map((row) => row.tag)
}
