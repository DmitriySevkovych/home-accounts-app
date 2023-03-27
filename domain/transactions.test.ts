import {Transaction} from './transactions'


describe('Transactions tests', () => {

    it.each`
        amount | expectedTransactionType
        ${20} | ${'income'}
        ${-5} | ${'expense'}
    `('should return $expectedTransactionType as transaction type when amount is $amount', ({amount, expectedTransactionType}) => {
        // Arrange
        const transaction = new Transaction(amount)
        // Act
        const transactionType = transaction.type()
        // Assert
        expect(transactionType).toBe(expectedTransactionType)
    })

})
