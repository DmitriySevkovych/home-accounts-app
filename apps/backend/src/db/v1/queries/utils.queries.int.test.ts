import type { Pool } from 'pg'

import { RepositoryLocator } from '../../repositoryLocator'
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
        RepositoryLocator.setRepository(repository)
    })
    afterAll(async () => {
        await RepositoryLocator.closeRepository()
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

    it('should return false if a tag does not yet exist in the database', async () => {
        // Arrange
        // Act
        const tagExists = await utilsQueries.tagExists(
            connectionPool,
            'unknownTag'
        )
        // Assert
        expect(tagExists).toBe(false)
    })

    it('should create a new tag in the database and return true when checking that it exists', async () => {
        // Arrange
        const tag = 'VacationSomewhere'

        // Act & Assert
        let tagExists = await utilsQueries.tagExists(connectionPool, tag)
        expect(tagExists).toBe(false)

        await utilsQueries.insertTag(connectionPool, tag)

        tagExists = await utilsQueries.tagExists(connectionPool, tag)
        expect(tagExists).toBe(true)
    })

    it('should throw an error when trying to create the same tag twice', async () => {
        // Arrange
        const tag = 'UniqueTag'
        await utilsQueries.insertTag(connectionPool, tag)
        // Act
        const secondInsertion = async () => {
            await utilsQueries.insertTag(connectionPool, tag)
        }
        // Assert
        await expect(secondInsertion).rejects.toThrowError()
    })
})
