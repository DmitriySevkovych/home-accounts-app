import { TimeRange, TransactionAggregate } from 'domain-model'
import { Pool } from 'pg'

export const getGroupedByDate = async (
    connectionPool: Pool,
    timeRange: TimeRange
): Promise<TransactionAggregate[]> => {
    const query = {
        name: 'select-from-transactions-group-by-date',
        text: `
        SELECT category, context, sum(amount*exchange_rate) as amount
        FROM transactions.transactions
        WHERE date BETWEEN $1 AND $2 
        GROUP BY category, context;`,
        values: [timeRange.from, timeRange.until],
    }

    const queryResult = await connectionPool.query(query)

    const { rowCount, rows } = queryResult
    if (rowCount === 0) {
        return []
    }
    return rows.map(
        (row) =>
            ({
                category: row.category,
                context: row.context,
                amount: row.amount,
                type:
                    row.amount < 0 || row.category === 'CORRECTION'
                        ? 'expense'
                        : 'income',
            } satisfies TransactionAggregate)
    )
}
