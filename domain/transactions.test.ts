import { Transaction } from './transactions'


describe('Transactions tests', () => {

    it('should work and currently do nothing', () => {
        // Arrange
        const transaction = new Transaction()
        // Act
        // Assert
        expect(transaction).toBeDefined()
    })
})