/*
    @group unit
    @group domain
 */

import { TransactionDate } from '../dates.model'
import { TransactionValidationError } from '../errors.model'
import {
    createTransaction,
    deserializeTransaction,
} from '../transactions.model'

describe('Transactions tests', () => {
    it.each`
        amount | expectedCashflow
        ${20}  | ${'income'}
        ${-5}  | ${'expense'}
    `(
        'transaction cashflow should be $expectedCashflow when amount is $amount',
        ({ amount, expectedCashflow }) => {
            // Arrange
            const transaction = createTransaction().withAmount(amount).build()
            // Act
            const transactionType = transaction.type()
            // Assert
            expect(transactionType.cashflow).toBe(expectedCashflow)
            expect(transactionType.specificTo).toBe('home')
        }
    )

    it.each`
        specifics                        | expectedSpecificTo
        ${undefined}                     | ${'home'}
        ${{ vat: 0.19, country: 'UA' }}  | ${'work'}
        ${{ investment: 'Real Estate' }} | ${'investments'}
    `(
        'transaction should be recognized as specific to $expectedSpecificTo when specifics is $specifics',
        ({ specifics, expectedSpecificTo }) => {
            // Arrange
            const transaction = createTransaction()
                .withAmount(-6.78)
                .withSpecifics(specifics)
                .build()
            // Act
            const transactionType = transaction.type()
            // Assert
            expect(transactionType.specificTo).toBe(expectedSpecificTo)
            expect(transactionType.cashflow).toBe('expense')
        }
    )

    it('should return right equivalent in EUR', () => {
        // Arrange
        const transaction = createTransaction()
            .withAmount(10)
            .withCurrency('XXX', 0.8)
            .build()
        // Act
        const transactionEurEquivalent = transaction.eurEquivalent()
        // Assert
        expect(transactionEurEquivalent).toBe(8)
    })

    it.each`
        taxCategory          | expectedTaxRelevant
        ${'EINKOMMENSTEUER'} | ${true}
        ${undefined}         | ${false}
    `(
        'should return taxRelevant $expectedTaxRelevant when taxCategory is $taxCategory',
        ({ taxCategory, expectedTaxRelevant }) => {
            // Arrange
            const transaction = createTransaction()
                .withTaxCategory(taxCategory)
                .build()
            // Act
            const isTaxRelevant = transaction.taxRelevant()
            // Assert
            expect(isTaxRelevant).toBe(expectedTaxRelevant)
        }
    )

    it('should successfully validate and build a Transaction object with minimum required data', () => {
        // Arrange
        const transactionBuilder = createTransaction()
            .about('FOOD', 'Test origin', '')
            .withAmount(3.0)
            .withDate(TransactionDate.today())
            .withPaymentTo('TRANSFER', 'HOME_ACCOUNT')
        // Act
        const transaction = transactionBuilder.validate().build()
        // Assert
        expect(transaction).toBeDefined()
    })

    it.each`
        amount
        ${0}
        ${undefined}
    `('should fail validation and throw if amount is $amount', ({ amount }) => {
        // Arrange
        const transactionBuilder = createTransaction()
            .about('FOOD', 'Test origin', '')
            .withAmount(amount)
            .withDate(TransactionDate.today())
            .withPaymentTo('TRANSFER', 'HOME_ACCOUNT')
        // Act
        const validation = () => {
            transactionBuilder.validate()
        }
        // Assert
        expect(validation).toThrow(TransactionValidationError)
    })

    it.each`
        amount | sourceBankAccount | targetBankAccount
        ${100} | ${undefined}      | ${undefined}
        ${100} | ${'IRRELEVANT'}   | ${undefined}
        ${-99} | ${undefined}      | ${undefined}
        ${-99} | ${undefined}      | ${'IRRELEVANT'}
    `(
        'should fail validation and throw if amount does not match bank accounts',
        ({ amount, sourceBankAccount, targetBankAccount }) => {
            // Arrange
            const transactionBuilder = createTransaction()
                .about('FOOD', 'Test origin', '')
                .withAmount(amount)
                .withDate(TransactionDate.today())
                .withPaymentDetails(
                    'TRANSFER',
                    sourceBankAccount,
                    targetBankAccount
                )
            // Act
            const validation = () => {
                transactionBuilder.validate()
            }
            // Assert
            expect(validation).toThrow(TransactionValidationError)
        }
    )

    it('should deserialize a Transaction object from a POST request body', () => {
        // Arrange
        const receivedRequestBody = {
            category: 'FOOD',
            origin: 'Grocery store',
            description: 'Some tasty food',
            amount: -45.67,
            date: {
                datetime: '2023-06-14T14:48:00.000Z',
            },
            paymentMethod: 'EC',
            sourceBankAccount: 'HOME_ACCOUNT',
            tags: ['Test', 'Tag'],
            agent: 'Testbot',
        }
        // Act
        const transaction = deserializeTransaction(receivedRequestBody)
        // Assert
        expect(transaction).toBeDefined()
        expect(transaction.date.toString()).toBe('2023-06-14')
    })

    it('should throw a TransactionValidationError because of an incorrect date', () => {
        // Arrange
        const malformedRequestBody = {
            // malformed date field
            date: {
                bla: '2023-06-14T14:48:00.000Z',
            },
            // mandatory information
            category: 'FOOD',
            origin: 'Grocery store',
            amount: -45.67,
            paymentMethod: 'EC',
            sourceBankAccount: 'HOME_ACCOUNT',
            agent: 'Testbot',
        }
        // Act
        const deserialization = () => {
            deserializeTransaction(malformedRequestBody)
        }
        // Assert
        expect(deserialization).toThrow(TransactionValidationError)
    })
})
