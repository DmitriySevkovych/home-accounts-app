import {
    TimeRange,
    TimeRangeCalculator,
    TransactionAggregate,
    TransactionAggregateByMonth,
} from 'domain-model'
import { Pool } from 'pg'

export const aggregateTransactions = async (
    connectionPool: Pool,
    timeRange: TimeRange
): Promise<TransactionAggregate[]> => {
    const query = {
        name: 'aggregate-transactions',
        text: `
            SELECT
                category,
                context,
                origin,
                sum(amount*exchange_rate) AS amount,
                investment
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
            GROUP BY
                category,
                context,
                investment,
                origin;`,
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
                timeRange,
            } satisfies TransactionAggregate)
    )
}

export const aggregateTransactionsByMonth = async (
    connectionPool: Pool,
    timeRange: TimeRange
): Promise<TransactionAggregateByMonth[]> => {
    const query = {
        name: 'aggregate-transactions-by-month',
        text: `
            SELECT
                category,
                context,
                sum(amount*exchange_rate) AS amount,
                DATE_TRUNC('month', date) AS transaction_month
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
            GROUP BY
                category,
                context,
                DATE_TRUNC('month', date)
            ORDER BY 
                transaction_month DESC,
                context;`,
        values: [timeRange.from, timeRange.until, ['ZeroSumTransaction']],
    }
    const queryResult = await connectionPool.query(query)
    const { rowCount, rows } = queryResult
    if (rowCount === 0) {
        return []
    }
    return rows.map((row) => {
        const { from, until } = TimeRangeCalculator.fromDate(
            row.transaction_month
        )
            .toEndOfMonth()
            .get()

        return {
            timeRange: {
                from,
                until,
            },
            category: row.category,
            context: row.context,
            amount: row.amount,
            type:
                row.amount < 0 || row.category === 'CORRECTION'
                    ? 'expense'
                    : 'income',
        }
    })
}
