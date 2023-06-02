import type { Pool } from 'pg'

import { RepositoryLocator } from '../../repositoryLocator'
import { PostgresRepository } from '../postgresRepository'
import {
    TransactionDAO,
    _getTransactionDAOById,
    _insertTransactionDAO,
} from './transactions.queries'

/*
    @group integration
    @group with-real-database
 */
describe('Database queries targeting the transactions schema', () => {
    let connectionPool: Pool
    beforeAll(() => {
        const repository = new PostgresRepository()
        connectionPool = repository.connectionPool
        RepositoryLocator.setRepository(repository)
    })
    afterAll(async () => {
        await RepositoryLocator.closeRepository()
    })

    it('getTransactionDAOById should return null if no matching id exists', async () => {
        // Arrange
        const fakeId = 1234
        // Act
        const queriedTransaction = await _getTransactionDAOById(
            fakeId,
            connectionPool
        )
        // Assert
        expect(queriedTransaction).toBeNull()
    })

    it('insertTransactionDAO should create a new entry in the database and getTransactionDAOById should retrieve it', async () => {
        // Arrange
        const transaction: TransactionDAO = {
            date: new Date(),
            amount: 9.99,
            currency: 'EUR',
            exchangeRate: 1,
            agent: 'IntegrationTest',
            sourceBankAccount: 'HOME_ACCOUNT',
        }
        const client = await connectionPool.connect()
        // Act
        let insertedTransactionId
        try {
            insertedTransactionId = await _insertTransactionDAO(
                transaction,
                client
            )
        } finally {
            client.release()
        }
        // Assert
        expect(insertedTransactionId).toBeDefined()
        const queriedTransaction = await _getTransactionDAOById(
            insertedTransactionId,
            connectionPool
        )
        expect(queriedTransaction).not.toBeNull()
    })

    // TODO test that either sourceBankAccount or targetBankAccount must be set on the transactionDAO object. Otherwise
})
