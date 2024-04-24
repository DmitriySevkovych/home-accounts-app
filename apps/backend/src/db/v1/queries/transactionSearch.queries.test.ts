import * as queries from './transactionSearch.queries'

/*
    @group unit
 */
describe('Unit tests for generated search conditions', () => {
    it('should return pg value placeholders $1 and $2, and update the passed in state counter', () => {
        // Arrange
        const state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        const first = queries.forTest._to$(state)
        const second = queries.forTest._to$(state)
        // Assert
        expect(first).toBe('$1')
        expect(second).toBe('$2')
        expect(state.counter).toBe(2)
    })

    it('should return correct WHERE-IN SQL condition', () => {
        // Arrange
        let state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        state = queries.forTest._whereIn('names', ['Tim', 'Tom', 'Bob'], state)
        // Assert
        expect(state.conditions).toStrictEqual(['names IN ($1,$2,$3)'])
        expect(state.values).toStrictEqual(['Tim', 'Tom', 'Bob'])
        expect(state.counter).toBe(3)
    })

    it('should return correct WHERE-LIKE SQL condition', () => {
        // Arrange
        let state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        state = queries.forTest._whereLike('description', 'eer', state)
        // Assert
        expect(state.conditions).toStrictEqual([
            "description LIKE '%' || $1 || '%'",
        ])
        expect(state.values).toStrictEqual(['eer'])
        expect(state.counter).toBe(1)
    })

    it('should return correct case insensitive WHERE-LIKE SQL condition', () => {
        // Arrange
        let state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        state = queries.forTest._whereLike('origin', 'aldi', state, {
            caseInsensitive: true,
        })
        // Assert
        expect(state.conditions).toStrictEqual([
            "UPPER(origin) LIKE '%' || UPPER($1) || '%'",
        ])
        expect(state.values).toStrictEqual(['aldi'])
        expect(state.counter).toBe(1)
    })

    it('should return correct WHERE-LEQ SQL condition', () => {
        // Arrange
        let state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        state = queries.forTest._whereLessOrEqual(
            'date',
            new Date('2024-04-13'),
            state
        )
        // Assert
        expect(state.conditions).toStrictEqual(['date <= $1'])
        expect(state.values).toStrictEqual([new Date('2024-04-13')])
        expect(state.counter).toBe(1)
    })

    it('should return correct WHERE-GEQ SQL condition', () => {
        // Arrange
        let state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        state = queries.forTest._whereLessOrEqual('something', 45.6, state)
        // Assert
        expect(state.conditions).toStrictEqual(['something <= $1'])
        expect(state.values).toStrictEqual([45.6])
        expect(state.counter).toBe(1)
    })

    it('should return correct WHERE-BETWEEN SQL condition', () => {
        // Arrange
        let state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        state = queries.forTest._whereBetween(
            'date',
            new Date('2024-01-01'),
            new Date('2024-12-31'),
            state
        )
        // Assert
        expect(state.conditions).toStrictEqual(['date BETWEEN $1 AND $2'])
        expect(state.values).toStrictEqual([
            new Date('2024-01-01'),
            new Date('2024-12-31'),
        ])
        expect(state.counter).toBe(2)
    })

    it('should return correct intervals for SQL WHERE condition', () => {
        // Arrange
        let state: queries.QueryConditionState = {
            counter: 0,
            conditions: [],
            values: [],
        }
        // Act
        state = queries.forTest._whereInInterval(
            'colA',
            undefined,
            new Date('2023-05-23'),
            state
        )
        state = queries.forTest._whereInInterval(
            'colB',
            new Date('2023-06-24'),
            undefined,
            state
        )
        state = queries.forTest._whereInInterval(
            'colC',
            new Date('2023-07-25'),
            new Date('2023-08-26'),
            state
        )
        // Assert
        expect(state.conditions).toStrictEqual([
            'colA <= $1',
            'colB >= $2',
            'colC BETWEEN $3 AND $4',
        ])
        expect(state.values).toStrictEqual([
            new Date('2023-05-23'),
            new Date('2023-06-24'),
            new Date('2023-07-25'),
            new Date('2023-08-26'),
        ])
        expect(state.counter).toBe(4)
    })
})
