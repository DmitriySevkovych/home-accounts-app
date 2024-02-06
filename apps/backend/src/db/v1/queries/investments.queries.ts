import { Investment, InvestmentType, dateFromString } from 'domain-model'
import type { Pool, PoolClient } from 'pg'

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

export const getInvestmentForTransactionId = async (
    transactionId: number,
    connectionPool: Pool
): Promise<string> => {
    const query = {
        name: 'select-from-investments.investment_transactions-where-id',
        text: `SELECT investment FROM investments.investment_transactions WHERE transaction_id = $1`,
        values: [transactionId],
    }
    const queryResult = await connectionPool.query(query)
    return queryResult.rows[0].investment
}

export const associateTransactionWithInvestment = async (
    transactionId: number,
    investment: string,
    client: PoolClient
): Promise<void> => {
    const query = {
        name: 'insert-into-investments.investment_transactions',
        text: `
            INSERT INTO investments.investment_transactions (investment, transaction_id) 
            VALUES ($1, $2)
            ON CONFLICT (transaction_id) DO UPDATE
            SET investment = $1`,
        values: [investment, transactionId],
    }
    await client.query(query)
}
