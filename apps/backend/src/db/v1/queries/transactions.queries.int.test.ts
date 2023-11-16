import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import { TransactionDAO, insertTransactionDAO } from './transactions.queries'

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
