import { minimalDummyTransaction } from '../helpers/test-fixtures'
import { createTransactionBlueprint } from '../models/blueprints.model'

/*
    @group unit
    @group domain
 */
describe('Blueprints tests', () => {
    it.each`
        startDate                                       | expirationDate                                   | expectedActive
        ${new Date()}                                   | ${undefined}                                     | ${true}
        ${new Date('2024-01-08')}                       | ${new Date().setDate(new Date().getDate() + 1)}  | ${true}
        ${new Date('2024-01-06')}                       | ${new Date('2024-01-07')}                        | ${false}
        ${new Date().setDate(new Date().getDate() + 1)} | ${undefined}                                     | ${false}
        ${new Date().setDate(new Date().getDate() + 1)} | ${new Date().setDate(new Date().getDate() + 30)} | ${false}
    `(
        'Blueprint should have the attribute isActive=$expectedActive when startDate is $startDate and expirationDate is $expirationDate',
        ({ startDate, expirationDate, expectedActive }) => {
            // Arrange
            const blueprint = createTransactionBlueprint('TEST_ISACTIVE_FLAG')
                .withTransaction(minimalDummyTransaction('FOOD', -1.02))
                .from(startDate)
                .until(expirationDate)
                .build()
            // Act
            const isActive = blueprint.isActive()
            // Assert
            expect(isActive).toBe(expectedActive)
        }
    )

    it.each`
        context          | amount   | expectedTargetTable
        ${'home'}        | ${-2.01} | ${'home.expenses'}
        ${'home'}        | ${2.02}  | ${'home.income'}
        ${'work'}        | ${-2.03} | ${'work.expenses'}
        ${'work'}        | ${2.04}  | ${'work.income'}
        ${'investments'} | ${-2.05} | ${'investments.expenses'}
        ${'investments'} | ${2.06}  | ${'investments.income'}
    `(
        'Blueprint should have the target table $expectedTargetTable when transaction context is $context and transaction amount is $type',
        ({ context, amount, expectedTargetTable }) => {
            // Arrange
            const transaction = minimalDummyTransaction('FEE', amount)
            transaction.context = context

            const blueprint = createTransactionBlueprint('TEST_TARGET_TABLE')
                .withTransaction(transaction)
                .build()
            // Act
            const targetTable = blueprint.targetTable()
            // Assert
            expect(targetTable).toBe(expectedTargetTable)
        }
    )
})
