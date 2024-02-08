import {
    minimalDummyInvestmentTransaction,
    minimalDummyTransaction,
} from 'domain-model'
import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import {
    associateTransactionWithInvestment,
    getInvestmentForTransactionId,
} from './investments.queries'
import { getTransactionById, insertTransaction } from './transactions.queries'

/*
    @group integration
    @group with-real-database
 */
describe('Database queries targeting the investments schema', () => {
    let connectionPool: Pool
    beforeAll(() => {
        const repository = new PostgresRepository()
        connectionPool = repository.connectionPool
    })
    afterAll(async () => {
        await connectionPool.end()
    })

    it('An investment transaction should be deserialized with the relevant investment field', async () => {
        // Arrange
        const transaction = minimalDummyInvestmentTransaction(
            'TAX',
            -23.77,
            'Homebrew'
        )
        const transactionId = await insertTransaction(
            connectionPool,
            transaction
        )
        // Act
        const queriedTransaction = await getTransactionById(
            connectionPool,
            transactionId
        )
        // Assert
        expect(queriedTransaction.investment).toBe('Homebrew')
    })

    it('Associating a transaction_id with an investment twice should override the former investment with the latter', async () => {
        // Arrange
        const transaction = minimalDummyTransaction('TAX', -222.13)
        const transactionId = await insertTransaction(
            connectionPool,
            transaction
        )
        const client = await connectionPool.connect()
        // Act
        await client.query('BEGIN')
        associateTransactionWithInvestment(transactionId, 'Homebrew', client)
        await client.query('COMMIT')
        await client.query('BEGIN')
        associateTransactionWithInvestment(
            transactionId,
            'Precious_Metals',
            client
        )
        await client.query('COMMIT')
        await client.release()
        // Assert
        const investment = await getInvestmentForTransactionId(
            transactionId,
            connectionPool
        )
        expect(investment).toBe('Precious_Metals')
    })
})
