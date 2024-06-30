import {
    DateCheck,
    TimeRangeCalculator,
    addDays,
    dateFromString,
    formatDate,
    getMonthDifference,
    getNextDay,
    getNextWorkday,
    getNumberOfDaysInMonth,
    timestampFromString,
} from './dates.model'

/*
    @group unit
    @group domain
 */
describe('Tests for dealing with dates', () => {
    describe('Date formatting tests', () => {
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
    }) // end 'Tests for dealing with date formatting'

    describe('DateCheck tests', () => {
        it.each`
            dateStr                       | otherDateStr                  | expectedSameDay
            ${'1999-09-09'}               | ${'1999-09-09'}               | ${true}
            ${'1999-09-09'}               | ${'1999-10-10'}               | ${false}
            ${'1999-11-11'}               | ${'1999-10-10'}               | ${false}
            ${'2024-01-12'}               | ${'2024-01-12T19:03:27.603Z'} | ${true}
            ${'2024-01-12T12:00:00.000Z'} | ${'2024-01-13'}               | ${false}
            ${'2024-01-12T12:00:00.000Z'} | ${'2024-01-12T19:03:27.603Z'} | ${true}
            ${'2024-01-12T12:00:00.000Z'} | ${'2024-01-13T19:03:27.603Z'} | ${false}
            ${'2024-01-11T11:00:00.000Z'} | ${'2024-01-12T19:03:27.603Z'} | ${false}
        `(
            'should determine whether $dateStr is the same day as $otherDateStr or not',
            ({ dateStr, otherDateStr, expectedSameDay }) => {
                // Arrange
                const date = new Date(Date.parse(dateStr))
                const otherDate = new Date(Date.parse(otherDateStr))
                // Act & Assert
                expect(DateCheck.check(date).isSameDayAs(otherDate)).toBe(
                    expectedSameDay
                )
                expect(DateCheck.check(date).isNotSameDayAs(otherDate)).toBe(
                    !expectedSameDay
                )
            }
        )

        it.each`
            dateStr         | otherDateStr    | expectedBefore | expectedAfter
            ${'1999-09-09'} | ${'1999-09-09'} | ${false}       | ${false}
            ${'1999-09-09'} | ${'1999-10-10'} | ${true}        | ${false}
            ${'1999-11-11'} | ${'1999-10-10'} | ${false}       | ${true}
        `(
            'should determine whether $dateStr is before or after $otherDateStr',
            ({ dateStr, otherDateStr, expectedBefore, expectedAfter }) => {
                // Arrange
                const date = new Date(Date.parse(dateStr))
                const otherDate = new Date(Date.parse(otherDateStr))
                // Act & Assert
                expect(DateCheck.check(date).isBefore(otherDate)).toBe(
                    expectedBefore
                )
                expect(DateCheck.check(date).isNotBefore(otherDate)).toBe(
                    !expectedBefore
                )
                expect(DateCheck.check(date).isAfter(otherDate)).toBe(
                    expectedAfter
                )
                expect(DateCheck.check(date).isNotAfter(otherDate)).toBe(
                    !expectedAfter
                )
            }
        )

        it.each`
            dateStr                       | otherDateStr                  | precision     | expectedBefore | expectedAfter
            ${'2024-01-16T12:00:00.000Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'exact'}    | ${true}        | ${false}
            ${'2024-01-16T23:30:00.000Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'exact'}    | ${false}       | ${true}
            ${'2024-01-16T21:23:21.603Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'exact'}    | ${false}       | ${false}
            ${'2024-01-16T12:00:00.000Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'day-wise'} | ${false}       | ${false}
            ${'2024-01-15T22:48:00.000Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'day-wise'} | ${true}        | ${false}
            ${'2024-01-16T23:30:00.000Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'day-wise'} | ${false}       | ${false}
            ${'2024-01-17T03:30:00.000Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'day-wise'} | ${false}       | ${true}
            ${'2024-01-16T21:23:21.603Z'} | ${'2024-01-16T21:23:21.603Z'} | ${'day-wise'} | ${false}       | ${false}
        `(
            'taking time into account and using $precision precision, should determine whether $dateStr is before or after $otherDateStr',
            ({
                dateStr,
                otherDateStr,
                precision,
                expectedBefore,
                expectedAfter,
            }) => {
                // Arrange
                const date = new Date(Date.parse(dateStr))
                const otherDate = new Date(Date.parse(otherDateStr))
                // Act & Assert
                expect(
                    DateCheck.check(date).isBefore(otherDate, precision)
                ).toBe(expectedBefore)
                expect(
                    DateCheck.check(date).isNotBefore(otherDate, precision)
                ).toBe(!expectedBefore)
                expect(
                    DateCheck.check(date).isAfter(otherDate, precision)
                ).toBe(expectedAfter)
                expect(
                    DateCheck.check(date).isNotAfter(otherDate, precision)
                ).toBe(!expectedAfter)
            }
        )
    }) // end 'DateCheck tests'

    describe('Date manipulation tests', () => {
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
            ${'2021-01-01'} | ${'2021-01-31'} | ${0}
            ${'2021-02-03'} | ${'2021-02-03'} | ${0}
            ${'2021-02-03'} | ${'2021-03-02'} | ${0}
            ${'2021-02-03'} | ${'2021-03-03'} | ${1}
            ${'2021-02-03'} | ${'2021-03-04'} | ${1}
            ${'2021-02-03'} | ${'2021-03-31'} | ${1}
            ${'2021-02-03'} | ${'2021-04-01'} | ${1}
            ${'2021-02-10'} | ${'2021-05-03'} | ${2}
            ${'2021-03-07'} | ${'2022-03-06'} | ${11}
            ${'2021-03-07'} | ${'2022-03-07'} | ${12}
            ${'2021-03-07'} | ${'2022-06-15'} | ${15}
        `(
            'getMonthDifference with (default) mode=floor should return $expectedMonths month between $startDateStr and $endDateStr',
            ({ startDateStr, endDateStr, expectedMonths }) => {
                // Arrange
                const start = new Date(startDateStr)
                const end = new Date(endDateStr)
                // Act
                const n = getMonthDifference(start, end, 'floor')
                // Assert
                expect(n).toBe(expectedMonths)
            }
        )

        it.each`
            startDateStr    | endDateStr      | expectedMonths
            ${'2021-01-01'} | ${'2021-01-31'} | ${1}
            ${'2021-02-03'} | ${'2021-02-03'} | ${0}
            ${'2021-02-03'} | ${'2021-03-02'} | ${1}
            ${'2021-02-03'} | ${'2021-03-03'} | ${1}
            ${'2021-02-03'} | ${'2021-03-04'} | ${1}
            ${'2021-02-03'} | ${'2021-03-31'} | ${2}
            ${'2021-02-03'} | ${'2021-04-01'} | ${2}
            ${'2021-02-10'} | ${'2021-05-03'} | ${3}
            ${'2021-03-07'} | ${'2022-03-06'} | ${12}
            ${'2021-03-07'} | ${'2022-03-07'} | ${12}
            ${'2021-03-07'} | ${'2022-06-15'} | ${15}
        `(
            'getMonthDifference with mode=round should return $expectedMonths month between $startDateStr and $endDateStr',
            ({ startDateStr, endDateStr, expectedMonths }) => {
                // Arrange
                const start = new Date(startDateStr)
                const end = new Date(endDateStr)
                // Act
                const n = getMonthDifference(start, end, 'round')
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
    }) // end 'Date manipulation tests'

    describe('DateRangeCalculator tests', () => {
        it('should return a range from beginning of this year until today', () => {
            // Arrange
            const today = new Date()
            // Act
            const { from, until } = TimeRangeCalculator.fromToday()
                .goBackToBeginningOfThisYear()
                .get()
            // Assert
            expect(from.toISOString()).toBe(
                `${today.getFullYear()}-01-01T00:00:00.000Z`
            )
            expect(until.toISOString()).toBe(
                `${formatDate(today)}T00:00:00.000Z`
            )
        })

        it('should return the full last year', () => {
            // Arrange
            const today = new Date()
            const lastFullYear = today.getFullYear() - 1
            // Act
            const { from, until } = TimeRangeCalculator.fromEndOfLastYear()
                .goBack(11, 'months')
                .toBeginningOfMonth()
                .get()
            // Assert
            expect(from.toISOString()).toBe(
                `${lastFullYear}-01-01T00:00:00.000Z`
            )
            expect(until.toISOString()).toBe(
                `${lastFullYear}-12-31T00:00:00.000Z`
            )
        })

        it('should return a range of three months from 2023-03-01 until 2023-05-31', () => {
            // Arrange
            // Act
            const { from, until } = TimeRangeCalculator.fromDate('2023-05-31')
                .goBack(2, 'months')
                .toBeginningOfMonth()
                .get()
            // Assert
            expect(from.toISOString()).toBe('2023-03-01T00:00:00.000Z')
            expect(until.toISOString()).toBe('2023-05-31T00:00:00.000Z')
        })

        it('should return a range from 2023-01-31 until 2023-04-01', () => {
            // Arrange
            // Act
            const { from, until } = TimeRangeCalculator.fromDate('2023-04-01')
                .goBack(3, 'months')
                .toEndOfMonth()
                .get()
            // Assert
            expect(from.toISOString()).toBe('2023-01-31T23:59:59.999Z')
            expect(until.toISOString()).toBe('2023-04-01T00:00:00.000Z')
        })
    })
})
