import { TransactionCategory } from 'domain-model'
import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import {
    TransactionDAO,
    getTransactionCategories,
    insertTransactionDAO,
} from './transactions.queries'

/*
    @group integration
    @group with-real-database
 */
describe('Database queries targeting only the transactions schema', () => {
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
        const result = await getTransactionCategories(connectionPool)
        const foodCategories = result.filter((c) => c.category === 'FOOD')
        const taxCategories = result.filter((c) => c.category === 'TAX')
        // Assert
        expect(result).toBeInstanceOf(Array)
        result.forEach((item: TransactionCategory) => {
            expect(item.category).toBeDefined()
            expect(item.context).toBeDefined()
        })

        expect(foodCategories.map((c) => c.context)).toStrictEqual(['home'])

        expect(taxCategories.map((c) => c.context).sort()).toStrictEqual([
            'home',
            'investments',
            'work',
        ])
    })

    it('insertTransactionDAO should create a new entry in the database', async () => {
        // Arrange
        const transaction: TransactionDAO = {
            context: 'home',
            date: new Date(),
            amount: 9.99,
            currency: 'EUR',
            exchangeRate: 1,
            agent: 'IntegrationTest-Agent',
            sourceBankAccount: 'HOME_ACCOUNT',
            paymentMethod: 'CASH',
        }
        const client = await connectionPool.connect()
        // Act
        let insertedTransactionId
        try {
            insertedTransactionId = await insertTransactionDAO(
                transaction,
                client
            )
        } finally {
            client.release()
        }
        // Assert
        expect(insertedTransactionId).toBeDefined()
    })
})
