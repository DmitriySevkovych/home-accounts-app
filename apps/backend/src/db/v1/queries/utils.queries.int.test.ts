import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import * as utilsQueries from './utils.queries'
import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'

/*
    @group integration
    @group with-real-database
 */
describe('Database queries targeting the utils schema', () => {
    let connectionPool: Pool
    beforeAll(() => {
        const repository = new PostgresRepository()
        connectionPool = repository.connectionPool
    })
    afterAll(async () => {
        await connectionPool.end()
    })

    it('getTransactionCategories returns an array of transaction categories with expected fields', async () => {
        // Arrange
        // Act
        const result = await utilsQueries.getTransactionCategories(
            connectionPool
        )
        // Assert
        expect(result).toBeInstanceOf(Array)
        result.forEach((item: TransactionCategory) => {
            expect(item.category).toBeDefined()
        })
    })

    it('getTaxCategories returns an array of tax categories with expected fields', async () => {
        // Arrange
        // Act
        const result = await utilsQueries.getTaxCategories(connectionPool)
        // Assert
        expect(result).toBeInstanceOf(Array)
        result.forEach((item: TaxCategory) => {
            expect(item.category).toBeDefined()
        })
    })

    it('getPaymentMethods returns an array of payment methods with expected fields', async () => {
        // Arrange
        // Act
        const result = await utilsQueries.getPaymentMethods(connectionPool)
        // Assert
        expect(result).toBeInstanceOf(Array)
        result.forEach((item: PaymentMethod) => {
            expect(item.method).toBeDefined()
        })
    })

    it('getBankAccounts returns an array of bank accounts with expected fields', async () => {
        // Arrange
        // Act
        const result = await utilsQueries.getBankAccounts(connectionPool)
        // Assert
        expect(result).toBeInstanceOf(Array)
        result.forEach((item: BankAccount) => {
            expect(item.account).toBeDefined()
            expect(item.bank).toBeDefined()
            expect(item.annualFee).toBeDefined()
            expect(item.category).toBeDefined()
        })
    })
})
