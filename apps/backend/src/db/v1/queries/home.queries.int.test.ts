import {
    HomeAppDate,
    Transaction,
    dummyTransaction,
    minimalDummyTransaction,
} from 'domain-model'
import type { Pool } from 'pg'

import { PostgresRepository } from '../postgresRepository'
import { getTransactionById, insertTransaction } from './home.queries'

/*
    @group integration
    @group with-real-database
 */
describe('Database queries targeting the home schema', () => {
    let connectionPool: Pool
    beforeAll(() => {
        const repository = new PostgresRepository()
        connectionPool = repository.connectionPool
    })
    afterAll(async () => {
        await connectionPool.end()
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
                HomeAppDate.fromString('2020-01-15')
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

    it('getTransactionById should return a home expense', async () => {
        // Arrange
        const category = 'FOOD'
        const amount = -5.99
        const transactionDate = HomeAppDate.fromString('2020-02-16')
        const id = await insertTransaction(
            dummyTransaction(category, amount, transactionDate),
            connectionPool
        )
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.date.toString()).toEqual(transactionDate.toString())
        expect(transaction.category).toBe(category)
        expect(transaction.type).toBe('expense')
        expect(transaction.context).toBe('home')
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.currency).toBe('USD') // value comes from dummyTransaction()
        expect(transaction.exchangeRate).toBe(0.95) // value comes from dummyTransaction()
        expect(transaction.agent).toBe('IntegrationTest-Agent') // value comes from dummyTransaction()
        expect(transaction.tags).toEqual(['Dummy', 'Test', 'ExpenseTag']) // value comes from dummyTransaction()
    })

    it('getTransactionById should return a home expense with correct defaults', async () => {
        // Arrange
        const category = 'FOOD'
        const amount = -15.99
        const id = await insertTransaction(
            minimalDummyTransaction(category, amount),
            connectionPool
        )
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.category).toBe(category)
        expect(transaction.type).toBe('expense')
        expect(transaction.context).toBe('home')
        expect(transaction.date.toString()).toEqual(
            HomeAppDate.today().toString()
        ) // default value!
        expect(transaction.currency).toBe('EUR') // default value!
        expect(transaction.exchangeRate).toBe(1) // default value!
        expect(transaction.tags).toEqual([]) // default value!
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.agent).toBe('IntegrationTest-Agent') // value comes from dummyTransaction()
        expect(transaction.paymentMethod).toBe('EC') // value comes from dummyTransaction()
        expect(transaction.sourceBankAccount).toBe('HOME_ACCOUNT') // value comes from dummyTransaction()
        expect(transaction.targetBankAccount).toBeNull()
    })

    it('getTransactionById should return a home income', async () => {
        // Arrange
        const category = 'SALARY'
        const amount = 19.99
        const transactionDate = HomeAppDate.fromString('2020-05-05')
        const id = await insertTransaction(
            dummyTransaction(category, amount, transactionDate),
            connectionPool
        )
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.date.toString()).toEqual(transactionDate.toString())
        expect(transaction.category).toBe(category)
        expect(transaction.type).toBe('income')
        expect(transaction.context).toBe('home')
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.exchangeRate).toBe(0.95) // value comes from dummyTransaction()
        expect(transaction.tags).toEqual(['Dummy', 'Test', 'IncomeTag']) // value comes from dummyTransaction()
    })

    it('getHomeIncomeById should return a home income with correct defaults', async () => {
        // Arrange
        const category = 'SALARY'
        const amount = 123.99
        const id = await insertTransaction(
            minimalDummyTransaction(category, amount),
            connectionPool
        )
        // Act
        const transaction = await getTransactionById(connectionPool, id)
        // Assert
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.category).toBe(category)
        expect(transaction.type).toBe('income')
        expect(transaction.context).toBe('home')
        expect(transaction.date.toString()).toEqual(
            HomeAppDate.today().toString()
        ) // default value!
        expect(transaction.currency).toBe('EUR') // default value!
        expect(transaction.exchangeRate).toBe(1) // default value!
        expect(transaction.tags).toEqual([]) // default value!
        expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
        expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
        expect(transaction.agent).toBe('IntegrationTest-Agent') // value comes from dummyTransaction()
        expect(transaction.paymentMethod).toBe('TRANSFER') // value comes from dummyTransaction()
        expect(transaction.sourceBankAccount).toBeNull()
        expect(transaction.targetBankAccount).toBe('BUSINESS_ACCOUNT') // value comes from dummyTransaction()
    })
})
