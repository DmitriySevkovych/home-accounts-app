import { TimeRange, TransactionAggregate } from 'domain-model'
import { Pool } from 'pg'

export const getGroupedByDate = async (
    connectionPool: Pool,
    timeRange: TimeRange
): Promise<TransactionAggregate[]> => {
    const query = {
        name: 'select-from-transactions-group-by-date',
        text: `
        SELECT category, context, origin, sum(amount*exchange_rate) AS amount, investment
        FROM transactions.transactions t
        LEFT JOIN (
            SELECT transaction_id, array_agg(tag) AS tag_array
            FROM transactions.transaction_tags 
            GROUP BY transaction_id
        ) tt ON t.id = tt.transaction_id
        LEFT JOIN investments.investment_transactions it ON t.id = it.transaction_id 
        WHERE date BETWEEN $1 AND $2
        AND (
            tag_array IS NULL 
            OR 
            NOT($3::varchar[] && tag_array)
        )
        GROUP BY category, context, investment, origin;`,
        values: [timeRange.from, timeRange.until, ['ZeroSumTransaction']],
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
                origin: row.origin,
                amount: row.amount,
                type:
                    row.amount < 0 || row.category === 'CORRECTION'
                        ? 'expense'
                        : 'income',
                investment: row.investment,
            } satisfies TransactionAggregate)
    )
}
