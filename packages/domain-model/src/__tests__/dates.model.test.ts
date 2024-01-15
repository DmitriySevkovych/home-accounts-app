import {
    DateCheck,
    addDays,
    dateFromString,
    formatDate,
    getMonthDifference,
    getNextDay,
    getNextWorkday,
    getNumberOfDaysInMonth,
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

    it.each`
        year      | month | expectedDays
        ${'2020'} | ${0}  | ${31}
        ${'2020'} | ${1}  | ${29}
        ${'2020'} | ${2}  | ${31}
        ${'2020'} | ${3}  | ${30}
        ${'2021'} | ${0}  | ${31}
        ${'2021'} | ${1}  | ${28}
        ${'2021'} | ${2}  | ${31}
        ${'2021'} | ${3}  | ${30}
    `(
        'getNumberOfDaysInMonth should return $expectedDays days for $year-$month',
        ({ year, month, expectedDays }) => {
            // Arrange
            // Act
            const n = getNumberOfDaysInMonth(year, month)
            // Assert
            expect(n).toBe(expectedDays)
        }
    )

    it.each`
        startDateStr    | endDateStr      | expectedMonths
        ${'2021-02-03'} | ${'2021-02-03'} | ${0}
        ${'2021-02-03'} | ${'2021-03-02'} | ${1}
        ${'2021-02-03'} | ${'2021-03-03'} | ${1}
        ${'2021-02-03'} | ${'2021-03-04'} | ${1}
        ${'2021-02-03'} | ${'2021-03-31'} | ${1}
        ${'2021-02-03'} | ${'2021-04-01'} | ${2}
        ${'2021-02-10'} | ${'2021-05-03'} | ${3}
        ${'2021-03-07'} | ${'2022-03-07'} | ${12}
        ${'2021-03-07'} | ${'2022-06-15'} | ${15}
    `(
        'getMonthDifference should return $expectedMonths month between $startDateStr and $endDateStr',
        ({ startDateStr, endDateStr, expectedMonths }) => {
            // Arrange
            const start = new Date(startDateStr)
            const end = new Date(endDateStr)
            // Act
            const n = getMonthDifference(start, end)
            // Assert
            expect(n).toBe(expectedMonths)
        }
    )

    it.each`
        dateStr         | step  | expectedDateStr
        ${'1998-03-09'} | ${0}  | ${'1998-03-09'}
        ${'1998-03-09'} | ${1}  | ${'1998-03-10'}
        ${'1998-03-09'} | ${7}  | ${'1998-03-16'}
        ${'1998-03-09'} | ${33} | ${'1998-04-11'}
    `(
        'addDays should step $step days into future and evaluate to $expectedDateStr',
        ({ dateStr, step, expectedDateStr }) => {
            // Arrange
            const date = new Date(Date.parse(dateStr))
            const expectedDate = new Date(expectedDateStr)
            // Act
            const nDaysFromDate = addDays(date, step)
            // Assert
            expect(nDaysFromDate).toStrictEqual(expectedDate)
        }
    )

    it('getNextDay should return the next days date', () => {
        // Arrange
        const date = new Date('1987-02-25')
        const expectedDate = new Date('1987-02-26')
        // Act && Assert
        expect(getNextDay(date)).toStrictEqual(expectedDate)
    })

    it.each`
        dateStr         | expectedDateStr
        ${'2024-01-15'} | ${'2024-01-15'}
        ${'2024-01-16'} | ${'2024-01-16'}
        ${'2024-01-19'} | ${'2024-01-19'}
        ${'2024-01-20'} | ${'2024-01-22'}
        ${'2024-01-21'} | ${'2024-01-22'}
    `(
        'getNextWorkday should return the next workday for weekend days and do nothing otherwise',
        ({ dateStr, expectedDateStr }) => {
            // Arrange
            const date = new Date(Date.parse(dateStr))
            const expectedDate = new Date(expectedDateStr)
            // Act
            const workday = getNextWorkday(date)
            // Assert
            expect(workday).toStrictEqual(expectedDate)
        }
    )
})
