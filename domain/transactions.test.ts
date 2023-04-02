import { Transaction } from './transactions'

describe('Transactions tests', () => {
    it('should work and currently do nothing', () => {
        // Arrange
        const transaction: Transaction = {
            _id: 1,
            date: new Date(),
            amount: -1,
            currency: 'EUR',
            exchange_rate: 1,
            source_bank_account: 'DummySourceBank',
            target_bank_account: 'DummyTargetBank',
            agent: 'DummyAgent',
            payment_method: 'TRANSFER',
        }
        // Act
        // Assert
        expect(transaction).toBeDefined()
    })
})
