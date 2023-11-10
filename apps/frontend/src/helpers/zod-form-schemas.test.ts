import { minimalDummyTransaction } from 'domain-model'
import { ZodError } from 'zod'

import { TransactionFormSchema } from './zod-form-schemas'

describe('Zod TransactionFormSchema tests', () => {
    it('should succeed for a valid transaction', () => {
        // Arrange
        const dummyTransaction = minimalDummyTransaction('FOOD', -10.5)
        // Act
        const result = TransactionFormSchema.parse(dummyTransaction)
        // Assert
        expect(result).toBeDefined()
    })

    it('should not allow amount to be 0', () => {
        // Arrange
        const data = minimalDummyTransaction('FOOD', 0)
        // Act
        const validation = () => TransactionFormSchema.parse(data)
        // Assert
        expect(validation).toThrow(ZodError)
    })

    it.each`
        amount
        ${1}
        ${-1}
    `('should always yield negative amount for expenses', ({ amount }) => {
        // Arrange
        const data = minimalDummyTransaction('FOOD', amount)
        data.type = 'expense'
        data.sourceBankAccount = 'VALID_ACCOUNT'
        // Act
        const transaction = TransactionFormSchema.parse(data)
        // Assert
        expect(transaction.amount).toBeLessThan(0)
    })

    it.each`
        transactionType | amount
        ${'income'}     | ${2}
        ${'income'}     | ${-2}
    `('should always yield positive amount for income', ({ amount }) => {
        // Arrange
        const data = minimalDummyTransaction('FOOD', amount)
        data.type = 'income'
        data.targetBankAccount = 'VALID_ACCOUNT'
        // Act
        const transaction = TransactionFormSchema.parse(data)
        // Assert
        expect(transaction.amount).toBeGreaterThan(0)
    })
})
