import { HomeAppDate } from '../models/dates.model'
import { Transaction, createTransaction } from '../models/transactions.model'

export const dummyTransaction = (
    category: string,
    amount: number,
    date: HomeAppDate
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
        transactionBuilder.withPaymentTo('TRANSFER', 'BUSINESS_ACCOUNT')
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
        transactionBuilder.withPaymentTo('TRANSFER', 'BUSINESS_ACCOUNT')
    } else {
        transactionBuilder.withPaymentFrom('EC', 'HOME_ACCOUNT')
    }

    return transactionBuilder.build()
}
