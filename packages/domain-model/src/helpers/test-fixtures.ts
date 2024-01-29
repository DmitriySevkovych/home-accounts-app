import { Investment } from '../models/investments.model'
import { Transaction, createTransaction } from '../models/transactions.model'
import { ProjectInvoice } from '../models/work.model'
import { PickAndFlatten } from './handy-types'

export const dummyTransaction = (
    category: string,
    amount: number,
    date: Date
): Transaction => {
    const transactionBuilder = createTransaction()
        .about(category, 'Test origin', 'A lengthy test description')
        .withAmount(amount)
        .withType(amount > 0 ? 'income' : 'expense')
        .withContext('home')
        .withDate(date)
        .withCurrency('USD', 0.95)
        .withComment('A dummy transaction, what else')
        .withAgent('IntegrationTest-Agent')
        .addTags(['Dummy', 'Test'])

    if (amount > 0) {
        transactionBuilder.withPaymentTo('TRANSFER', 'WORK_ACCOUNT')
        transactionBuilder.addTags(['IncomeTag'])
    } else {
        transactionBuilder.withPaymentFrom('EC', 'HOME_ACCOUNT')
        transactionBuilder.addTags(['ExpenseTag'])
    }

    return transactionBuilder.build()
}

export const minimalDummyTransaction = (
    category: string,
    amount: number
): Transaction => {
    const transactionBuilder = createTransaction()
        .about(category, 'Test origin', 'A lengthy test description')
        .withAmount(amount)
        .withType(amount > 0 ? 'income' : 'expense')
        .withContext('home')
        .withAgent('IntegrationTest-Agent')

    if (amount > 0) {
        transactionBuilder.withPaymentTo('TRANSFER', 'WORK_ACCOUNT')
    } else {
        transactionBuilder.withPaymentFrom('EC', 'HOME_ACCOUNT')
    }

    return transactionBuilder.build()
}

export const minimalDummyWorkTransaction = (
    category: string,
    amount: number,
    invoiceKey?: PickAndFlatten<ProjectInvoice, 'key'>
): Transaction => {
    const transaction = minimalDummyTransaction(category, amount)
    transaction.context = 'work'
    transaction.invoiceKey = invoiceKey ? invoiceKey : 'Any Invoice'
    transaction.vat = 0.19
    transaction.country = 'DE'
    return transaction
}

export const minimalDummyInvestmentTransaction = (
    category: string,
    amount: number,
    investment?: PickAndFlatten<Investment, 'key'>
): Transaction => {
    const transaction = minimalDummyTransaction(category, amount)
    transaction.context = 'investments'
    transaction.investment = investment ? investment : 'Any Investment'
    return transaction
}
