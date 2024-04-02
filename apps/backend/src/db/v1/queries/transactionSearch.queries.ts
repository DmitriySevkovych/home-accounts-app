import { SearchParameters } from "domain-model";
import { Pool, QueryConfig } from "pg";

type TransactionIds = number[]

const _getIntersectionSearchQuery = (parameters: SearchParameters): QueryConfig => {
    return {
        name: `search-intersection`,
        text: `
        SELECT id
        FROM transactions.transactions
        WHERE //TODO;`,
        values: [],
    }
}

export const search = async (connectionPool: Pool, parameters: SearchParameters): Promise<TransactionIds> => {
    // TODO if statement for getting intersection or union queries
    const query = _getIntersectionSearchQuery(parameters)

    const queryResult = await connectionPool.query(query)

    const { rowCount, rows } = queryResult
    if (rowCount === 0) {
        return []
    }
    return rows
}