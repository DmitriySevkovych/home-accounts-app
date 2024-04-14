import { SearchParameters } from 'domain-model'
import { Pool, QueryConfig } from 'pg'

import {
    PAGE_SIZE,
    Paginated,
    PaginationOptions,
} from '../../../helpers/pagination'

export type QueryConditionState = {
    counter: number
    conditions: string[]
    values: any[]
}

const _to$ = (state: QueryConditionState) => {
    state.counter++
    return `$${state.counter}`
}

const _whereIn = (
    column: string,
    values: string[] | undefined,
    state: QueryConditionState
): QueryConditionState => {
    if (!values || values.length === 0) return state

    const placeholders = values.map(() => _to$(state)).join(',')
    const newCondition = `${column} IN (${placeholders})`
    return {
        counter: state.counter,
        conditions: [...state.conditions, newCondition],
        values: [...state.values, ...values],
    }
}

const _whereLike = (
    column: string,
    value: string | undefined,
    state: QueryConditionState
): QueryConditionState => {
    if (!value) return state

    const newCondition = `${column} LIKE '%' || ${_to$(state)} || '%'`
    return {
        counter: state.counter,
        conditions: [...state.conditions, newCondition],
        values: [...state.values, value],
    }
}

const _whereLessOrEqual = (
    column: string,
    value: Date | number,
    state: QueryConditionState
): QueryConditionState => {
    const newCondition = `${column} <= ${_to$(state)}`
    return {
        counter: state.counter,
        conditions: [...state.conditions, newCondition],
        values: [...state.values, value],
    }
}

const _whereGreaterOrEqual = (
    column: string,
    value: Date | number,
    state: QueryConditionState
): QueryConditionState => {
    const newCondition = `${column} >= ${_to$(state)}`
    return {
        counter: state.counter,
        conditions: [...state.conditions, newCondition],
        values: [...state.values, value],
    }
}

const _whereBetween = (
    column: string,
    lower: Date | string | number,
    upper: Date | string | number,
    state: QueryConditionState
): QueryConditionState => {
    const newCondition = `${column} BETWEEN ${_to$(state)} AND ${_to$(state)}`
    return {
        counter: state.counter,
        conditions: [...state.conditions, newCondition],
        values: [...state.values, lower, upper],
    }
}

const _whereInInterval = (
    column: string,
    from: Date | number | undefined,
    until: Date | number | undefined,
    state: QueryConditionState
): QueryConditionState => {
    if (!(from || until)) return state

    if (!until) {
        return _whereGreaterOrEqual(column, from!, state)
    }
    if (!from) {
        return _whereLessOrEqual(column, until, state)
    }
    return _whereBetween(column, from, until, state)
}

const _getTagsCondition = (_tags: string[] | undefined) => undefined //TODO

const _getQuery = (
    parameters: SearchParameters,
    paginationOptions: PaginationOptions
): QueryConfig => {
    const {
        searchCombination,
        categories,
        origin,
        description,
        dateFrom,
        dateUntil,
        tags,
    } = parameters
    const { limit, offset } = paginationOptions

    let state: QueryConditionState = {
        counter: 0,
        conditions: [],
        values: [],
    }

    state = _whereIn('category', categories, state)
    state = _whereLike('origin', origin, state)
    state = _whereLike('description', description, state)
    state = _whereInInterval('date', dateFrom, dateUntil, state)
    _getTagsCondition(tags)

    if (state.conditions.length === 0) {
        return {
            text: 'SELECT id FROM transactions.transactions ORDER BY id DESC LIMIT $1 OFFSET $2',
            values: [limit, offset],
        }
    }

    const conditions = state.conditions.join(` ${searchCombination} `)
    return {
        text: `
        SELECT id
        FROM transactions.transactions
        WHERE ${conditions}
        ORDER BY id DESC 
        LIMIT ${_to$(state)} OFFSET ${_to$(state)};`,
        values: [...state.values, limit, offset],
    }
}

export const search = async (
    connectionPool: Pool,
    parameters: SearchParameters,
    paginationOptions: PaginationOptions
): Promise<{ ids: number[] } & Paginated> => {
    const queryResult = await connectionPool.query(
        _getQuery(parameters, paginationOptions)
    )

    const { rowCount, rows } = queryResult
    if (rowCount === 0) {
        return { ids: [], endReached: true }
    }
    return {
        ids: rows.map((row) => row.id),
        endReached: rowCount! < PAGE_SIZE,
    }
}

export const forTest = {
    _to$,
    _whereIn,
    _whereLike,
    _whereBetween,
    _whereGreaterOrEqual,
    _whereLessOrEqual,
    _whereInInterval,
}
