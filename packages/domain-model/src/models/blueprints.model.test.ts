import { createTransactionBlueprint } from './blueprints.model'
import { getNextWorkday } from './dates.model'

/*
    @group unit
    @group domain
 */
describe('Blueprints tests', () => {
    describe('Test when a blueprint is due', () => {
        // TODO  test edge cases, eg. when blueprint starts in the future

        /* ONE-TIME payment frequency */
        it('ONE-TIME blueprint should be due only on startDate, dueDay is irrelevant', () => {
            // Arrange
            const blueprint = createTransactionBlueprint('TEST_ONE-TIME_DUE')
                .due('ONE-TIME', 2)
                .from(new Date('2024-01-04'))
                .lastUpdatedOn(new Date('2024-01-01'))
                .build()
            // Act
            const dates = blueprint.getDatesWhenTransactionIsDue()
            // Assert
            expect(dates).toStrictEqual([new Date('2024-01-04')])
        })

        /* WEEKLY payment frequency */
        it.each`
            dueDay         | startDateStr    | endDateStr      | expectedDatesStr
            ${'TUESDAY'}   | ${'2023-12-01'} | ${'2023-12-24'} | ${['2023-12-05', '2023-12-12', '2023-12-19']}
            ${'WEDNESDAY'} | ${'2023-12-01'} | ${'2023-12-24'} | ${['2023-12-06', '2023-12-13', '2023-12-20']}
        `(
            'WEEKLY blueprint should be due on every $dueDay from $startDateStr until $endDateStr',
            ({ dueDay, startDateStr, endDateStr, expectedDatesStr }) => {
                // Arrange
                const blueprint = createTransactionBlueprint('TEST_WEEKLY_DUE')
                    .due('WEEKLY', dueDay)
                    .from(new Date(startDateStr))
                    .until(new Date(endDateStr))
                    .lastUpdatedOn(new Date('2023-12-01'))
                    .build()
                const expectedDates = expectedDatesStr.map(
                    (d: string) => new Date(d)
                )
                // Act
                const dates = blueprint.getDatesWhenTransactionIsDue()
                // Assert
                expect(dates.sort()).toStrictEqual(expectedDates.sort())
            }
        )

        /* MONTHLY payment frequency */
        it.each`
            dueDay        | unadjustedExpectedDatesStr
            ${1}          | ${['2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01']}
            ${3}          | ${['2023-02-03', '2023-03-03', '2023-04-03']}
            ${30}         | ${['2023-01-30', '2023-02-28', '2023-03-30', '2023-04-30']}
            ${31}         | ${['2023-01-31', '2023-02-28', '2023-03-31', '2023-04-30']}
            ${'LAST DAY'} | ${['2023-01-31', '2023-02-28', '2023-03-31', '2023-04-30']}
        `(
            'MONTHLY blueprint should be due on every day number $dueDay from startDate until endDate',
            ({ dueDay, unadjustedExpectedDatesStr }) => {
                // Arrange
                const blueprint = createTransactionBlueprint('TEST_MONTHLY_DUE')
                    .due('MONTHLY', dueDay)
                    .from(new Date('2023-01-08'))
                    .until(new Date('2023-05-02'))
                    .lastUpdatedOn(new Date('2023-01-01'))
                    .build()
                const expectedDates = unadjustedExpectedDatesStr.map(
                    (d: string) => getNextWorkday(new Date(d))
                )
                // Act
                const dates = blueprint.getDatesWhenTransactionIsDue()
                // Assert
                expect(dates.sort()).toStrictEqual(expectedDates.sort())
            }
        )

        it.each`
            lastUpdate
            ${'2023-12-31T00:00:00.000Z'}
            ${'2023-12-31T18:00:00.000Z'}
            ${'2023-12-31T23:00:00.000Z'}
            ${'2024-01-01T00:00:00.000Z'}
            ${'2024-01-01T00:01:00.000Z'}
        `(
            'lastUpdate date should not be considered a second time, input $lastUpdate',
            ({ lastUpdate }) => {
                // Arrange
                const blueprint = createTransactionBlueprint(
                    'TEST_MONTHLY_DUE_LAST_DAY'
                )
                    .due('MONTHLY', 'LAST DAY')
                    .from(new Date('2023-01-01'))
                    .until(new Date('2024-01-25'))
                    .lastUpdatedOn(new Date(lastUpdate))
                    .build()
                // Act
                let dates = blueprint.getDatesWhenTransactionIsDue()
                // Assert
                expect(dates).toStrictEqual([])
            }
        )

        /* QUARTERLY payment frequency */
        it.each`
            dueDay | unadjustedExpectedDatesStr
            ${10}  | ${['2023-02-10', '2023-05-10', '2023-08-10', '2023-11-10']}
            ${31}  | ${['2023-02-28', '2023-05-31', '2023-08-31', '2023-11-30']}
        `(
            'QUARTERLY blueprint should be due every three months on day number $dueDay from startDate until endDate',
            ({ dueDay, unadjustedExpectedDatesStr }) => {
                // Arrange
                const blueprint = createTransactionBlueprint(
                    'TEST_QUARTERLY_DUE'
                )
                    .due('QUARTERLY', dueDay)
                    .from(new Date('2023-02-10'))
                    .until(new Date('2023-12-31'))
                    .lastUpdatedOn(new Date('2022-11-01'))
                    .build()
                const expectedDates = unadjustedExpectedDatesStr.map(
                    (d: string) => getNextWorkday(new Date(d))
                )
                // Act
                const dates = blueprint.getDatesWhenTransactionIsDue()
                // Assert
                expect(dates.sort()).toStrictEqual(expectedDates.sort())
            }
        )

        /* SEMI-ANNUALLY payment frequency */
        it.each`
            dueDay        | unadjustedExpectedDatesStr
            ${15}         | ${['2022-12-15', '2023-06-15', '2023-12-15']}
            ${'LAST DAY'} | ${['2022-12-31', '2023-06-30', '2023-12-31']}
        `(
            'SEMI-ANNUALLY blueprint should be due every six months on day number $dueDay from startDate until endDate',
            ({ dueDay, unadjustedExpectedDatesStr }) => {
                // Arrange
                const blueprint = createTransactionBlueprint(
                    'TEST_SEMI-ANNUALLY_DUE'
                )
                    .due('SEMI-ANNUALLY', dueDay)
                    .from(new Date('2022-12-01'))
                    .until(new Date('2023-12-31'))
                    .lastUpdatedOn(new Date('2022-12-01'))
                    .build()
                const expectedDates = unadjustedExpectedDatesStr.map(
                    (d: string) => getNextWorkday(new Date(d))
                )
                // Act
                const dates = blueprint.getDatesWhenTransactionIsDue()
                // Assert
                expect(dates.sort()).toStrictEqual(expectedDates.sort())
            }
        )

        /* ANNUALLY payment frequency */
        it.each`
            dueDay        | unadjustedExpectedDatesStr
            ${24}         | ${['2022-11-24', '2023-11-24']}
            ${'LAST DAY'} | ${['2022-11-30', '2023-11-30']}
        `(
            'ANNUALLY blueprint should be due every year on day number $dueDay from startDate until endDate',
            ({ dueDay, unadjustedExpectedDatesStr }) => {
                // Arrange
                const blueprint = createTransactionBlueprint(
                    'TEST_ANNUALLY_DUE'
                )
                    .due('ANNUALLY', dueDay)
                    .from(new Date('2022-11-01'))
                    .until(new Date('2023-11-30'))
                    .lastUpdatedOn(new Date('2022-11-20'))
                    .build()
                const expectedDates = unadjustedExpectedDatesStr.map(
                    (d: string) => getNextWorkday(new Date(d))
                )
                // Act
                const dates = blueprint.getDatesWhenTransactionIsDue()
                // Assert
                expect(dates.sort()).toStrictEqual(expectedDates.sort())
            }
        )
    }) // end 'Test when a blueprint is due'
})
