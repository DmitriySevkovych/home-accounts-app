import { TransactionDate } from './dates.model'
import { Transaction, createTransaction } from './transactions.model'

export const dummyTransaction = (
    category: string,
    amount: number,
    date: TransactionDate
): Transaction => {
    const transactionBuilder = createTransaction()
        .about(category, 'Test origin', 'A lengthy test description')
        .withAmount(amount)
        .withDate(date)
        .withCurrency('USD', 0.95)
        .withComment('A dummy transaction, what else')
        .withAgent('IntegrationTest-Agent')
        .addTags(['Dummy', 'Test', 'Tags'])

    if (amount > 0) {
        transactionBuilder.withPaymentTo('TRANSFER', 'BUSINESS_ACCOUNT')
    } else {
        transactionBuilder.withPaymentFrom('EC', 'HOME_ACCOUNT')
    }

    return transactionBuilder.build()
}
