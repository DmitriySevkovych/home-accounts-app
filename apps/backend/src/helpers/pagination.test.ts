import { Request } from 'express'

import { BadQueryParameterInRequestError } from './errors'
import {
    PAGE_SIZE,
    getLimitAndOffset,
    getPaginationOptionsFromRequest,
} from './pagination'

/*
    @group unit
 */
describe('Helpers: pagination tests', () => {
    it('default page size should be 25', () => {
        expect(PAGE_SIZE).toBe(25)
    })

    it('should return a default PaginationOptions object if no query paramers are present', () => {
        // Arrange
        const reqMock = {} as Request
        // Act
        const paginationOptions = getPaginationOptionsFromRequest(reqMock)
        // Assert
        expect(paginationOptions).toBeDefined()
        expect(paginationOptions.page).toBe(1)
        expect(paginationOptions.forceFetchAll).toBeUndefined()
    })

    it.each`
        pageParam    | expectedOffset
        ${3}         | ${PAGE_SIZE * (3 - 1)}
        ${1}         | ${0}
        ${undefined} | ${0}
    `(
        'should return correct limit and offset if query has the parameters page=$pageParam',
        ({ pageParam, expectedOffset }) => {
            // Arrange
            const reqMock = {
                query: {
                    page: pageParam,
                },
            } as any as Request
            // Act
            const paginationOptions = getPaginationOptionsFromRequest(reqMock)
            const { limit, offset } = getLimitAndOffset(paginationOptions)
            // Assert
            expect(limit).toBe(PAGE_SIZE)
            expect(offset).toBe(expectedOffset)
        }
    )

    it('should throw error if query has illegal pagination parameters', () => {
        // Arrange
        const reqMock = {
            query: {
                page: 'ILLEGAL',
            },
        } as any as Request
        // Act
        const action = () => getPaginationOptionsFromRequest(reqMock)
        // Assert
        expect(action).toThrow(BadQueryParameterInRequestError)
    })
})
