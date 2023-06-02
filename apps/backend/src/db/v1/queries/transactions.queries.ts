import { Transaction } from 'domain-model'
import type { Pool, PoolClient } from 'pg'

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

export const insertTransaction = async (
    transaction: Transaction,
    connectionPool: Pool
): Promise<Transaction> => {
    const client = await connectionPool.connect()
    try {
        await client.query('BEGIN')

        const id = await _insertTransactionDAO(transaction, client)
        transaction.id = id

        await client.query('COMMIT')
        return transaction
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}

// TODO -> think about what is better suited here: return null if id is not found or throw an error? The user should never be able to query random/non-existing ids anyway
export const _getTransactionDAOById = async (
    id: number,
    connectionPool: Pool
): Promise<TransactionDAO | null> => {
    const query = {
        name: 'select-from-transactions.transactions-where-id',
        text: 'SELECT * FROM transactions.transactions WHERE id = $1',
        values: [id],
    }
    const queryResult = await connectionPool.query<TransactionDAO>(query)
    if (queryResult.rowCount === 0) {
        return null
    }
    return queryResult.rows[0]
}

export const _insertTransactionDAO = async (
    transactionDAO: TransactionDAO,
    client: PoolClient
): Promise<number> => {
    const {
        date,
        amount,
        sourceBankAccount,
        targetBankAccount,
        currency,
        exchangeRate,
        agent,
    } = transactionDAO
    const query = {
        name: 'insert-into-transactions.transactions',
        text: 'INSERT INTO transactions.transactions(date, amount, source_bank_account, target_bank_account, currency, exchange_rate, agent) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;',
        values: [
            date,
            amount,
            sourceBankAccount,
            targetBankAccount,
            currency,
            exchangeRate,
            agent,
        ],
    }
    const queryResult = await client.query(query)
    if (queryResult.rowCount === 0) {
        // TODO throw error
    }
    return queryResult.rows[0].id
}
