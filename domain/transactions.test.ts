import { createTransaction } from './transactions'

describe('Transactions tests', () => {
    it.each`
        amount | expectedTransactionType
        ${20}  | ${'income'}
        ${-5}  | ${'expense'}
    `(
        'should return $expectedTransactionType as transaction type when amount is $amount',
        ({ amount, expectedTransactionType }) => {
            // Arrange
            const transaction = createTransaction().withAmount(amount).build()
            // Act
            const transactionType = transaction.type()
            // Assert
            expect(transactionType).toBe(expectedTransactionType)
        }
    )

    it('should return right equivalent in EUR', () => {
        // Arrange
        const transaction = createTransaction()
            .withAmount(10)
            .withCurrency('XXX', 0.8)
            .build()
        // Act
        const transactionEurEquivalent = transaction.eurEquivalent()
        // Assert
        expect(transactionEurEquivalent).toBe(8)
    })

    it.each`
        taxCategory          | expectedTaxRelevant
        ${'EINKOMMENSTEUER'} | ${true}
        ${undefined}         | ${false}
    `(
        'should return taxRelevant $expectedTaxRelevant when taxCategory is $taxCategory',
        ({ taxCategory, expectedTaxRelevant }) => {
            // Arrange
            const transaction = createTransaction()
                .withTaxCategory(taxCategory)
                .build()
            // Act
            const isTaxRelevant = transaction.taxRelevant()
            // Assert
            expect(isTaxRelevant).toBe(expectedTaxRelevant)
        }
    )
})
