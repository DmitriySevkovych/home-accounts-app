import { HomeAppDate, Transaction, dummyTransaction } from 'domain-model'
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
        'insertTransaction should return a new transaction ID',
        async ({ amount, category, investment }) => {
            // Arrange
            const transaction: Transaction = dummyTransaction(
                category,
                amount,
                HomeAppDate.fromString('2020-01-15')
            )
            transaction.context = 'investments'
            transaction.investment = investment
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
        const context = 'investments'
        const investment = 'Apartment'
        const transactionToInsert = dummyTransaction(
            'MAINTENANCE',
            -5.99,
            HomeAppDate.fromString('2020-02-16')
        )
        transactionToInsert.context = context
        transactionToInsert.investment = investment
        const id = await insertTransaction(transactionToInsert, connectionPool)
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.type).toBe('expense')
        expect(transaction.context).toBe(context)
        expect(transaction.investment).toBe(investment)
    })

    it('getTransactionById should return an invesment income', async () => {
        // Arrange
        const context = 'investments'
        const investment = 'Apartment'
        const transactionToInsert = dummyTransaction(
            'RENT',
            19.99,
            HomeAppDate.fromString('2020-05-05')
        )
        transactionToInsert.context = context
        transactionToInsert.investment = investment
        const id = await insertTransaction(transactionToInsert, connectionPool)
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.type).toBe('income')
        expect(transaction.context).toBe(context)
        expect(transaction.investment).toBe(investment)
    })
})
