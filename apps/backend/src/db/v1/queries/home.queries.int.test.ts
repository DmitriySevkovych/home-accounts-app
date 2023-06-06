import type { Pool } from 'pg'

import { RepositoryLocator } from '../../repositoryLocator'
import { PostgresRepository } from '../postgresRepository'
import { getTransactionById, insertTransaction } from './home.queries'
import { Transaction, TransactionDate, createTransaction } from 'domain-model'

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

    it('insertTransaction should return a new transaction ID after successfully inserting into multiple tables', async () => {
        // Arrange
        const transaction: Transaction = dummyTransaction(
            2.99,
            TransactionDate.fromString('2020-01-15')
        )
        // Act
        const transactionId = await insertTransaction(
            transaction,
            connectionPool
        )
        // Assert
        expect(transactionId).toBeDefined()
    })

    it('getTransactionById should return a Transaction object', async () => {
        // Arrange
        const amount = -5.99
        const transactionDate = TransactionDate.fromString('2020-02-16')
        const id = await insertTransaction(
            dummyTransaction(amount, transactionDate),
            connectionPool
        )
        // Act
        const transaction = await getTransactionById(id, connectionPool)
        // Assert
        expect(transaction).toBeDefined()
        expect(transaction.id).toBe(id)
        expect(transaction.amount).toBe(amount)
        expect(transaction.date.toString()).toEqual(transactionDate.toString())
        expect(transaction.exchangeRate).toBe(0.95) // value comes from dummyTransaction()
    })
})

const dummyTransaction = (
    amount: number,
    date: TransactionDate
): Transaction => {
    const transactionBuilder = createTransaction()
        .about('FOOD', 'Test origin', 'A lengthy test description')
        .withAmount(amount)
        .withDate(date)
        .withCurrency('USD', 0.95)
        .withAgent('IntegrationTest-Agent')

    if (amount > 0) {
        transactionBuilder.withPaymentTo('TRANSFER', 'BUSINESS_ACCOUNT')
    } else {
        transactionBuilder.withPaymentFrom('EC', 'HOME_ACCOUNT')
    }

    return transactionBuilder.build()
}
