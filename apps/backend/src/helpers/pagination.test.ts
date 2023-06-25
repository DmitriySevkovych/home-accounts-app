import { Request } from 'express'
import {
    DEFAULT_PAGE_SIZE,
    getPaginationOptionsFromRequest,
} from './pagination'
import { BadQueryParameterInRequestError } from './errors'

/*
    @group unit
 */
describe('Helpers: pagination tests', () => {
    it('default page size should be 50', () => {
        expect(DEFAULT_PAGE_SIZE).toBe(50)
    })

    it('should return an empty PaginationOptions object if no query paramers are present', () => {
        // Arrange
        const reqMock = {} as Request
        // Act
        const paginationOptions = getPaginationOptionsFromRequest(reqMock)
        // Assert
        expect(paginationOptions).toBeDefined()
        expect(paginationOptions.limit).toBeUndefined()
        expect(paginationOptions.offset).toBeUndefined()
    })

    it.each`
        limit        | page
        ${100}       | ${3}
        ${undefined} | ${3}
        ${100}       | ${undefined}
        ${undefined} | ${undefined}
    `(
        'should return correct PaginationOptions if query has the parameters limit=$limit and page=$page',
        ({ limit, page }) => {
            // Arrange
            const reqMock = {
                query: {
                    limit: limit,
                    page: page,
                },
            } as any as Request
            // Act
            const paginationOptions = getPaginationOptionsFromRequest(reqMock)
            // Assert
            expect(paginationOptions.limit).toBe(limit)
            if (page) {
                expect(paginationOptions.offset).toBe(page * DEFAULT_PAGE_SIZE)
            } else {
                expect(paginationOptions.offset).toBeUndefined()
            }
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
