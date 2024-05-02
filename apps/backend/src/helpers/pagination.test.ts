import { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_PAGE_SIZE } from 'domain-model'
import { Request } from 'express'

import { BadQueryParameterInRequestError } from './errors'
import { getPaginationOptionsFromRequest } from './pagination'

/*
    @group unit
 */
describe('Helpers: pagination tests', () => {
    it('default page size should be 50', () => {
        expect(DEFAULT_PAGE_SIZE).toBe(50)
    })

    it('default offset should be 0', () => {
        expect(DEFAULT_OFFSET).toBe(0)
    })

    it('should return a default PaginationOptions object if no query paramers are present', () => {
        // Arrange
        const reqMock = {} as Request
        // Act
        const paginationOptions = getPaginationOptionsFromRequest(reqMock)
        // Assert
        expect(paginationOptions).toBeDefined()
        expect(paginationOptions.limit).toBe(DEFAULT_LIMIT)
        expect(paginationOptions.offset).toBe(DEFAULT_OFFSET)
    })

    it.each`
        limitParam   | expectedLimit
        ${100}       | ${100}
        ${undefined} | ${DEFAULT_LIMIT}
    `(
        'should return correct PaginationOptions.limit if query has the parameter limit=$limitParam',
        ({ limitParam, expectedLimit }) => {
            // Arrange
            const reqMock = {
                query: {
                    limit: limitParam,
                },
            } as any as Request
            // Act
            const paginationOptions = getPaginationOptionsFromRequest(reqMock)
            // Assert
            expect(paginationOptions.limit).toBe(expectedLimit)
            expect(paginationOptions.offset).toBe(DEFAULT_OFFSET)
        }
    )

    it.each`
        pageParam    | expectedOffset
        ${3}         | ${DEFAULT_PAGE_SIZE * (3 - 1)}
        ${1}         | ${0}
        ${undefined} | ${0}
    `(
        'should return correct PaginationOptions.offset if query has the parameters page=$pageParam',
        ({ pageParam, expectedOffset }) => {
            // Arrange
            const reqMock = {
                query: {
                    page: pageParam,
                },
            } as any as Request
            // Act
            const paginationOptions = getPaginationOptionsFromRequest(reqMock)
            // Assert
            expect(paginationOptions.limit).toBe(DEFAULT_LIMIT)
            expect(paginationOptions.offset).toBe(expectedOffset)
        }
    )

    it.each`
        limit        | page
        ${undefined} | ${'ILLEGAL'}
        ${'ILLEGAL'} | ${undefined}
    `(
        'should throw error if query has illegal pagination parameters',
        ({ limit, page }) => {
            // Arrange
            const reqMock = {
                query: {
                    limit: limit,
                    page: page,
                },
            } as any as Request
            // Act
            const action = () => getPaginationOptionsFromRequest(reqMock)
            // Assert
            expect(action).toThrow(BadQueryParameterInRequestError)
        }
    )
})
