import { Transaction, TransactionDate, dummyTransaction } from 'domain-model'
import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import { getTransactionById, insertTransaction } from './investments.queries'

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

    it.each`
        amount   | category  | investment
        ${20}    | ${'RENT'} | ${'Apartment'}
        ${-2.99} | ${'TAX'}  | ${'Apartment'}
    `(
        'insertTransaction should return a new transaction ID after successfully inserting into multiple tables',
        async ({ amount, category }) => {
            // Arrange
            const transaction: Transaction = dummyTransaction(
                category,
                amount,
                TransactionDate.fromString('2020-01-15')
            )
            transaction.context = 'investments'
            // Act
            const transactionId = await insertTransaction(
                transaction,
                connectionPool
            )
            // Assert
            expect(transactionId).toBeDefined()
        }
    )

    it('getTransactionById should return an investment expense', async () => {
        // Arrange
        const category = 'MAINTENANCE'
        const amount = -5.99
        const transactionDate = TransactionDate.fromString('2020-02-16')
        const context = 'investments'
        const transactionToInsert = dummyTransaction(
            category,
            amount,
            TransactionDate.fromString('2020-02-16')
        )
        transactionToInsert.context = context
        const id = await insertTransaction(transactionToInsert, connectionPool)
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.date.toString()).toEqual(transactionDate.toString())
        expect(transaction.category).toBe(category)
        expect(transaction.type).toBe('expense')
        expect(transaction.context).toBe(context)
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.currency).toBe('USD') // value comes from dummyTransaction()
        expect(transaction.exchangeRate).toBe(0.95) // value comes from dummyTransaction()
        expect(transaction.agent).toBe('IntegrationTest-Agent') // value comes from dummyTransaction()
        expect(transaction.tags).toEqual(['Dummy', 'Test', 'ExpenseTag']) // value comes from dummyTransaction()
    })

    it('getTransactionById should return an invesment income', async () => {
        // Arrange
        const category = 'RENT'
        const amount = 19.99
        const transactionDate = TransactionDate.fromString('2020-05-05')
        const context = 'investments'
        const transactionToInsert = dummyTransaction(
            category,
            amount,
            transactionDate
        )
        transactionToInsert.context = context
        const id = await insertTransaction(
            dummyTransaction(category, amount, transactionDate),
            connectionPool
        )
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction).toBeDefined()
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.date.toString()).toEqual(transactionDate.toString())
        expect(transaction.category).toBe(category)
        expect(transaction.type).toBe('income')
        expect(transaction.context).toBe(context)
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.exchangeRate).toBe(0.95) // value comes from dummyTransaction()
        expect(transaction.tags).toEqual(['Dummy', 'Test', 'IncomeTag']) // value comes from dummyTransaction()
    })
})
