/*
    @group unit
    @group domain
 */

import { TransactionDate } from '../dates'
import { createTransaction } from '../transactions'

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
        ${{ investment: 'Real Estate' }} | ${'investment'}
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
        expect(validation).toThrowError()
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
            expect(validation).toThrowError()
        }
    )
})
