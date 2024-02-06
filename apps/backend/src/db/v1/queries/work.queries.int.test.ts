import { minimalDummyWorkTransaction } from 'domain-model'
import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import { getTransactionById, insertTransaction } from './transactions.queries'
import {
    associateTransactionWithProjectInvoice,
    getInvoiceKeyForTransactionId,
    insertTransactionVAT,
} from './work.queries'

/*
    @group integration
    @group with-real-database
 */
describe('Database queries targeting the work schema', () => {
    let connectionPool: Pool
    beforeAll(() => {
        const repository = new PostgresRepository()
        connectionPool = repository.connectionPool
    })
    afterAll(async () => {
        await connectionPool.end()
    })

    it('A work income should be deserialized with the relevant vat and country fields', async () => {
        // Arrange
        const transaction = minimalDummyWorkTransaction(
            'SALARY',
            1846.39,
            'INV-0123456'
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
        expect(queriedTransaction.invoiceKey).toBe('INV-0123456')
    })

    it('Associating a transaction_id with an invoice twice should override the former invoice with the latter', async () => {
        // Arrange
        const transaction = minimalDummyWorkTransaction(
            'SALARY',
            2432.11,
            'INV-0123456'
        )
        const transactionId = await insertTransaction(
            connectionPool,
            transaction
        )
        const client = await connectionPool.connect()
        // Act
        await client.query('BEGIN')
        associateTransactionWithProjectInvoice(
            transactionId,
            'INV-0123456',
            client
        )
        await client.query('COMMIT')
        await client.query('BEGIN')
        associateTransactionWithProjectInvoice(
            transactionId,
            'INV-0123457',
            client
        )
        await client.query('COMMIT')
        // Assert
        const investment = await getInvoiceKeyForTransactionId(
            transactionId,
            connectionPool
        )
        expect(investment).toEqual('INV-0123457')
    })

    it('Updating VAT information for a transaction_id should be possible', async () => {
        // Arrange
        const transaction = minimalDummyWorkTransaction('FEE', -47.69)
        const transactionId = await insertTransaction(
            connectionPool,
            transaction
        )
        const client = await connectionPool.connect()
        // Act
        await client.query('BEGIN')
        insertTransactionVAT(
            {
                id: transactionId,
                vat: 0,
                country: 'UA',
            },
            client
        )
        await client.query('COMMIT')
        await client.query('BEGIN')
        insertTransactionVAT(
            {
                id: transactionId,
                vat: 0.19,
                country: 'DE',
            },
            client
        )
        await client.query('COMMIT')
        // Assert
        const queriedTransaction = await getTransactionById(
            connectionPool,
            transactionId
        )
        expect(queriedTransaction.vat).toBe(0.19)
        expect(queriedTransaction.country).toBe('DE')
    })

    it('A work expense should be deserialized with the relevant vat and country fields', async () => {
        // Arrange
        const transaction = minimalDummyWorkTransaction('FEE', -47.69)
        transaction.vat = 0.19
        transaction.country = 'DE'
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
        expect(queriedTransaction.vat).toBe(0.19)
        expect(queriedTransaction.country).toBe('DE')
    })
})
