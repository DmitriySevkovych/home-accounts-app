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

    it('timestampFromString should convert to a numeric timestamp', () => {
        // Arrange
        const dateString = '2011-01-02'
        // Act
        const timestamp = timestampFromString(dateString)
        // Assert
        expect(typeof timestamp).toBe('number')
    })

    it.each`
        dateString
        ${'1999-08-02'}
        ${'1999-08-02T00:00:00.000Z'}
        ${'1999-08-02T14:48:00.000Z'}
    `(
        'dateFromString should convert $dateString to a JS Date object',
        ({ dateString }) => {
            // Act
            const jsDate = dateFromString(dateString)
            // Assert
            expect(jsDate).toBeInstanceOf(Date)
            expect(jsDate.toISOString().split('T')[0]).toBe('1999-08-02')
        }
    )

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
