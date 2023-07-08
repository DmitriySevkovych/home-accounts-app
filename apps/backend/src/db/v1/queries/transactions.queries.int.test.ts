import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import {
    TransactionDAO,
    getTransactionDAOById,
    insertTransactionDAO,
} from './transactions.queries'
import { TransactionDate } from 'domain-model'

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

    it('getTransactionDAOById should throw an error if no matching id exists', async () => {
        // Arrange
        const fakeId = 1234
        // Act
        const queryFakeId = async () => {
            await getTransactionDAOById(fakeId, connectionPool)
        }
        // Assert
        await expect(queryFakeId).rejects.toThrow(
            new Error(
                `Found no rows in transactions.transactions with id=${fakeId}.`
            )
        )
    })

    it('insertTransactionDAO should create a new entry in the database and getTransactionDAOById should retrieve it', async () => {
        // Arrange
        const transaction: TransactionDAO = {
            date: TransactionDate.today(),
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
        const queriedTransaction = await getTransactionDAOById(
            insertedTransactionId,
            connectionPool
        )
        expect(queriedTransaction).not.toBeNull()
    })

    // TODO test that either sourceBankAccount or targetBankAccount must be set on the transactionDAO object. Otherwise
})
