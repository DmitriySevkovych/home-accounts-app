import {
    DateCheck,
    dateFromString,
    formatDate,
    timestampFromString,
} from '../models/dates.model'

/*
    @group unit
    @group domain
 */
describe('Tests for dealing with dates', () => {
    it('formatDate should create a date string in YYYY-MM-DD format', () => {
        // Arrange
        const today = new Date()
        // Act
        const formattedDateString = formatDate(today)
        // Assert
        expect(formattedDateString).toBe(today.toISOString().split('T')[0])
    })

    // it('should not change a date string in YYYY-MM-DD format', () => {
    //     // Arrange
    //     const expectedDateString = '2023-06-04'
    //     // Act
    //     const date = HomeAppDate.fromString('2023-06-04')
    //     // Assert
    //     expect(date.toString()).toBe(expectedDateString)
    // })

    // it('should create a date string in YYYY-MM-DD format from a date string in a different format', () => {
    //     // Arrange
    //     const expectedDateString = '2023-06-04'
    //     // Act
    //     const date = HomeAppDate.fromString('Sunday, June 4, 2023', 'DDDD')
    //     // Assert
    //     expect(date.toString()).toBe(expectedDateString)
    // })

    // it('should create a date string in YYYY-MM-DD format when date is queried from a database table', () => {
    //     // Arrange
    //     const expectedDateString = '2023-06-04'
    //     // Act
    //     const date = HomeAppDate.fromDatabase('2023-06-04')
    //     // Assert
    //     expect(date.toString()).toBe(expectedDateString)
    // })

    // it('should create a date string in YYYY-MM-DD format from a JS Date object', () => {
    //     // Arrange
    //     const jsDate = new Date('1995-12-17T03:24:00')
    //     const expectedDateString = '1995-12-17'
    //     // Act
    //     const date = HomeAppDate.fromJsDate(jsDate)
    //     // Assert
    //     expect(date.toString()).toBe(expectedDateString)
    // })

    it('timestampFromString should convert to a numeric timestamp', () => {
        // Arrange
        const dateString = '2011-01-02'
        // Act
        const timestamp = timestampFromString(dateString)
        // Assert
        expect(typeof timestamp).toBe('number')
    })

    it('dateFromString should convert to a JS Date object', () => {
        // Arrange
        const dateString = '2011-01-02'
        // Act
        const jsDate = dateFromString(dateString)
        // Assert
        expect(jsDate).toBeInstanceOf(Date)
    })

    it.each`
        dateStr         | otherDateStr    | expectedBefore | expectedAfter
        ${'1999-09-09'} | ${'1999-09-09'} | ${false}       | ${false}
        ${'1999-09-09'} | ${'1999-10-10'} | ${true}        | ${false}
        ${'1999-11-11'} | ${'1999-10-10'} | ${false}       | ${true}
    `(
        'DateCheck should correctly determine whether one date is before or after another date',
        ({ dateStr, otherDateStr, expectedBefore, expectedAfter }) => {
            // Arrange
            const date = new Date(Date.parse(dateStr))
            const otherDate = new Date(Date.parse(otherDateStr))
            // Act & Assert
            expect(new DateCheck(date).isBefore(otherDate)).toBe(expectedBefore)
            expect(new DateCheck(date).isNotBefore(otherDate)).toBe(
                !expectedBefore
            )
            expect(new DateCheck(date).isAfter(otherDate)).toBe(expectedAfter)
            expect(new DateCheck(date).isNotAfter(otherDate)).toBe(
                !expectedAfter
            )
        }
    )
})
