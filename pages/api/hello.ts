import { Transaction } from '../../domain/transactions'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
const hello = (req: NextApiRequest, res: NextApiResponse) => {
    const transaction: Transaction = {
        _id: 1,
        date: new Date(),
        amount: -1,
        currency: 'EUR',
        exchange_rate: 1,
        source_bank_account: 'DummySourceBank',
        target_bank_account: 'DummyTargetBank',
        agent: 'DummyAgent',
        payment_method: 'TRANSFER'
    }
    res.status(200).json(transaction)  
}

export default hello
