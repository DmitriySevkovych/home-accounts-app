import { Transaction, createTransaction } from '../../domain/transactions'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
const hello = (req: NextApiRequest, res: NextApiResponse) => {
    const transaction: Transaction = createTransaction()
        .about('FOOD', 'Some origin', 'This is a dummy transaction')
        .withAmount(123)
        .withCurrency('DummyMoney', 999)
        .withPaymentFrom('TRANSFER', 'DummyBank')
        .withAgent('Dummy Agent')
        .addTags(['Test', 'Tag'])
        .build()
    res.status(200).json(transaction)
}

export default hello
