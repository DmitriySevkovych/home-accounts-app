import { Transaction, dateFromString, dummyTransaction } from 'domain-model'
import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import { getTransactionById, insertTransaction } from './work.queries'

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

    it("insertTransaction with type 'expense' should return a new transaction ID", async () => {
        // Arrange
        const transaction: Transaction = dummyTransaction(
            'SALARY',
            -500,
            dateFromString('2021-05-17')
        )
        transaction.context = 'work'
        transaction.vat = 0.19
        transaction.country = 'DE'
        // Act
        const transactionId = await insertTransaction(
            connectionPool,
            transaction
        )
        // Assert
        expect(transactionId).toBeDefined()
    })

    it('getTransactionById should return a work expense', async () => {
        // Arrange
        const context = 'work'
        const vat = 0.19
        const country = 'UK'
        const transactionToInsert = dummyTransaction(
            'FEE',
            -5.99,
            dateFromString('2023-07-26')
        )
        transactionToInsert.context = context
        transactionToInsert.vat = vat
        transactionToInsert.country = country
        const id = await insertTransaction(connectionPool, transactionToInsert)
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.type).toBe('expense')
        expect(transaction.context).toBe(context)
        expect(transaction.vat).toBe(vat)
        expect(transaction.country).toBe(country)
    })

    it("insertTransaction with type 'income' should return a new transaction ID", async () => {
        // Arrange
        const transaction: Transaction = dummyTransaction(
            'SALARY',
            2000,
            dateFromString('2021-01-27')
        )
        transaction.context = 'work'
        transaction.invoiceKey = 'INV-0123456' // REM: testdata that is present in the database
        // Act
        const transactionId = await insertTransaction(
            connectionPool,
            transaction
        )
        // Assert
        expect(transactionId).toBeDefined()
    })

    it('getTransactionById should return an work income', async () => {
        // Arrange
        const context = 'work'
        const invoiceKey = 'INV-0123456'
        const transactionToInsert = dummyTransaction(
            'RENT',
            198.99,
            dateFromString('2020-11-11')
        )
        transactionToInsert.context = context
        transactionToInsert.invoiceKey = invoiceKey
        const id = await insertTransaction(connectionPool, transactionToInsert)
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.type).toBe('income')
        expect(transaction.context).toBe(context)
        expect(transaction.invoiceKey).toBe(invoiceKey)
    })
})
