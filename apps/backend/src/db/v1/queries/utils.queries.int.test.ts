import { BankAccount, PaymentMethod, TaxCategory } from 'domain-model'
import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import * as utilsQueries from './utils.queries'

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

    describe('Blueprints tests', () => {
        it('should retrieve active blueprints', async () => {
            // Arrange -> test data is already imported into the db
            // Act
            const result =
                await utilsQueries.getActiveBlueprints(connectionPool)
            const blueprintKeys = result.map((r) => r.key)
            // Assert
            expect(result).toHaveLength(9)
            expect(blueprintKeys).toContain('BP_HOME_3')
            expect(blueprintKeys).not.toContain('BP_HOME_5_EXPIRED')
        })
    })
})
