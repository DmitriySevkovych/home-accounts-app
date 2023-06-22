import type { Pool } from 'pg'

import { RepositoryLocator } from '../../repositoryLocator'
import { PostgresRepository } from '../postgresRepository'
import {
    getHomeExpenseById,
    getHomeIncomeById,
    insertTransaction,
} from './home.queries'
import { Transaction, TransactionDate, dummyTransaction } from 'domain-model'

/*
    @group integration
    @group with-real-database
 */
describe('Database queries targeting the home schema', () => {
    let connectionPool: Pool
    beforeAll(() => {
        const repository = new PostgresRepository()
        connectionPool = repository.connectionPool
        RepositoryLocator.setRepository(repository)
    })
    afterAll(async () => {
        await RepositoryLocator.closeRepository()
    })

    it.each`
        amount   | category
        ${20}    | ${'SALARY'}
        ${-2.99} | ${'FOOD'}
    `(
        'insertTransaction should return a new transaction ID after successfully inserting into multiple tables',
        async ({ amount, category }) => {
            // Arrange
            const transaction: Transaction = dummyTransaction(
                category,
                amount,
                TransactionDate.fromString('2020-01-15')
            )
            // Act
            const transactionId = await insertTransaction(
                transaction,
                connectionPool
            )
            // Assert
            expect(transactionId).toBeDefined()
        }
    )

    it('getHomeExpenseById should return a Transaction representing a home expense', async () => {
        // Arrange
        const category = 'FOOD'
        const amount = -5.99
        const transactionDate = TransactionDate.fromString('2020-02-16')
        const id = await insertTransaction(
            dummyTransaction(category, amount, transactionDate),
            connectionPool
        )
        // Act
        const transaction = await getHomeExpenseById(id, connectionPool)
        // Assert
        expect(transaction).toBeDefined()
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.date.toString()).toEqual(transactionDate.toString())
        expect(transaction.category).toBe(category)
        expect(transaction.type().cashflow).toBe('expense')
        expect(transaction.type().specificTo).toBe('home')
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.exchangeRate).toBe(0.95) // value comes from dummyTransaction()
        expect(transaction.tags).toEqual(['Dummy', 'Test', 'ExpenseTag']) // value comes from dummyTransaction()
    })

    it('getHomeIncomeById should return a Transaction representing a home income', async () => {
        // Arrange
        const category = 'SALARY'
        const amount = 19.99
        const transactionDate = TransactionDate.fromString('2020-05-05')
        const id = await insertTransaction(
            dummyTransaction(category, amount, transactionDate),
            connectionPool
        )
        // Act
        const transaction = await getHomeIncomeById(id, connectionPool)
        // Assert
        expect(transaction).toBeDefined()
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.date.toString()).toEqual(transactionDate.toString())
        expect(transaction.category).toBe(category)
        expect(transaction.type().cashflow).toBe('income')
        expect(transaction.type().specificTo).toBe('home')
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.exchangeRate).toBe(0.95) // value comes from dummyTransaction()
        expect(transaction.tags).toEqual(['Dummy', 'Test', 'IncomeTag']) // value comes from dummyTransaction()
    })
})
