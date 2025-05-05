import {
    Transaction,
    TransactionCategory,
    dateFromString,
    dummyTransaction,
    formatDate,
    minimalDummyTransaction,
} from 'domain-model'
import type { Pool } from 'pg'

import { tx } from '../../helpers'
import { PostgresRepository } from '../postgresRepository'
import {
    getTransactionById,
    getTransactionCategories,
    insertTransaction,
} from './transactions.queries'

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

    it('getTransactionCategories returns an array of transaction categories with expected fields', async () => {
        // Arrange
        // Act
        const result = await getTransactionCategories(connectionPool)
        const foodCategories = result.filter((c) => c.category === 'FOOD')
        const taxCategories = result.filter((c) => c.category === 'TAX')
        // Assert
        expect(result).toBeInstanceOf(Array)
        result.forEach((item: TransactionCategory) => {
            expect(item.category).toBeDefined()
            expect(item.context).toBeDefined()
        })

        expect(foodCategories.map((c) => c.context)).toStrictEqual(['home'])

        expect(taxCategories.map((c) => c.context).sort()).toStrictEqual([
            'home',
            'investments',
            'work',
        ])
    })

    describe('home context', () => {
        it.each`
            amount   | category
            ${20}    | ${'SALARY'}
            ${-2.99} | ${'FOOD'}
        `(
            'insertTransaction ($amount, $category) should return a new transaction ID after successfully inserting into multiple tables',
            async ({ amount, category }) => {
                // Arrange
                const transaction: Transaction = dummyTransaction(
                    category,
                    amount,
                    dateFromString('2020-01-15')
                )
                // Act
                const transactionId = await tx(
                    await connectionPool.connect(),
                    (client) => {
                        return insertTransaction(client, transaction)
                    }
                )
                // Assert
                expect(transactionId).toBeDefined()
            }
        )

        it('getTransactionById should return a home expense', async () => {
            // Arrange
            const category = 'FOOD'
            const amount = -5.99
            const transactionDate = dateFromString('2020-02-16')
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(
                    client,
                    dummyTransaction(category, amount, transactionDate)
                )
            })
            // Act
            const transaction = await getTransactionById(connectionPool, id)
            // Assert
            expect(transaction.id).toBe(id)
            expect(transaction.amount).toBe(amount)
            expect(transaction.date).toEqual(transactionDate)
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
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(
                    client,
                    minimalDummyTransaction(category, amount)
                )
            })
            // Act
            const transaction = await getTransactionById(connectionPool, id)
            // Assert
            expect(transaction.id).toBe(id)
            expect(transaction.amount).toBe(amount)
            expect(transaction.category).toBe(category)
            expect(transaction.type).toBe('expense')
            expect(transaction.context).toBe('home')
            expect(formatDate(transaction.date)).toEqual(formatDate(new Date())) // default value!
            expect(transaction.currency).toBe('EUR') // default value!
            expect(transaction.exchangeRate).toBe(1) // default value!
            expect(transaction.tags).toEqual([]) // default value!
            expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
            expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
            expect(transaction.agent).toBe('IntegrationTest-Agent') // value comes from dummyTransaction()
            expect(transaction.paymentMethod).toBe('EC') // value comes from dummyTransaction()
            expect(transaction.sourceBankAccount).toBe('HOME_ACCOUNT') // value comes from dummyTransaction()
            expect(transaction.targetBankAccount).toBeUndefined()
        })

        it('getTransactionById should return a home income', async () => {
            // Arrange
            const category = 'SALARY'
            const amount = 19.99
            const transactionDate = dateFromString('2020-05-05')
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(
                    client,
                    dummyTransaction(category, amount, transactionDate)
                )
            })
            // Act
            const transaction = await getTransactionById(connectionPool, id)
            // Assert
            expect(transaction.id).toBe(id)
            expect(transaction.amount).toBe(amount)
            expect(transaction.date).toEqual(transactionDate)
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
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(
                    client,
                    minimalDummyTransaction(category, amount)
                )
            })
            // Act
            const transaction = await getTransactionById(connectionPool, id)
            // Assert
            expect(transaction.id).toBe(id)
            expect(transaction.amount).toBe(amount)
            expect(transaction.category).toBe(category)
            expect(transaction.type).toBe('income')
            expect(transaction.context).toBe('home')
            expect(formatDate(transaction.date)).toEqual(formatDate(new Date())) // default value!
            expect(transaction.currency).toBe('EUR') // default value!
            expect(transaction.exchangeRate).toBe(1) // default value!
            expect(transaction.tags).toEqual([]) // default value!
            expect(transaction.origin).toBe('Test origin') // value comes from dummyTransaction()
            expect(transaction.description).toBe('A lengthy test description') // value comes from dummyTransaction()
            expect(transaction.agent).toBe('IntegrationTest-Agent') // value comes from dummyTransaction()
            expect(transaction.paymentMethod).toBe('TRANSFER') // value comes from dummyTransaction()
            expect(transaction.sourceBankAccount).toBeUndefined()
            expect(transaction.targetBankAccount).toBe('WORK_ACCOUNT') // value comes from dummyTransaction()
        })
    })

    describe('investments context', () => {
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
                    dateFromString('2020-01-15')
                )
                transaction.context = 'investments'
                transaction.investment = investment
                // Act
                const transactionId = await tx(
                    await connectionPool.connect(),
                    (client) => {
                        return insertTransaction(client, transaction)
                    }
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
                dateFromString('2020-02-16')
            )
            transactionToInsert.context = context
            transactionToInsert.investment = investment
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(client, transactionToInsert)
            })
            // Act
            const transaction = await getTransactionById(connectionPool, id)
            // Assert
            expect(transaction.id).toBe(id)
            expect(transaction.type).toBe('expense')
            expect(transaction.context).toBe(context)
            expect(transaction.investment).toBe(investment)
        })

        it('getTransactionById should return an investment income', async () => {
            // Arrange
            const context = 'investments'
            const investment = 'Apartment'
            const transactionToInsert = dummyTransaction(
                'RENT',
                19.99,
                dateFromString('2020-05-05')
            )
            transactionToInsert.context = context
            transactionToInsert.investment = investment
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(client, transactionToInsert)
            })
            // Act
            const transaction = await getTransactionById(connectionPool, id)
            // Assert
            expect(transaction.id).toBe(id)
            expect(transaction.type).toBe('income')
            expect(transaction.context).toBe(context)
            expect(transaction.investment).toBe(investment)
        })
    })

    describe('work context', () => {
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
            const transactionId = await tx(
                await connectionPool.connect(),
                (client) => {
                    return insertTransaction(client, transaction)
                }
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
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(client, transactionToInsert)
            })
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
            const transactionId = await tx(
                await connectionPool.connect(),
                (client) => {
                    return insertTransaction(client, transaction)
                }
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
            const id = await tx(await connectionPool.connect(), (client) => {
                return insertTransaction(client, transactionToInsert)
            })
            // Act
            const transaction = await getTransactionById(connectionPool, id)
            // Assert
            expect(transaction.id).toBe(id)
            expect(transaction.type).toBe('income')
            expect(transaction.context).toBe(context)
            expect(transaction.invoiceKey).toBe(invoiceKey)
        })
    })
})
