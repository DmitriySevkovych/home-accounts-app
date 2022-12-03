import { Transaction } from '../../domain/transactions'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
const hello = (req: NextApiRequest, res: NextApiResponse) => {
    const transaction = new Transaction()
    res.status(200).json(transaction)  
}

export default hello
