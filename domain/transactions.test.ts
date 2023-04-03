import { Transaction } from './transactions'

describe('Transactions tests', () => {
    it.each`
        amount | expectedTransactionType
        ${20}  | ${'income'}
        ${-5}  | ${'expense'}
    `(
        'should return $expectedTransactionType as transaction type when amount is $amount',
        ({ amount, expectedTransactionType }) => {
            // Arrange
            const transaction = new Transaction({
                amount,
            })
            // Act
            const transactionType = transaction.type()
            // Assert
            expect(transactionType).toBe(expectedTransactionType)
        }
    )

    it('should return right equivalent in EUR', () => {
        // Arrange
        const transaction = new Transaction({
            amount: 10,
            exchangeRate: 0.8,
        })
        // Act
        const transactionEurEquivalent = transaction.eurEquivalent()
        // Assert
        expect(transactionEurEquivalent).toBe(8)
    })
})
