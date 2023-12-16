import { Transaction, formatDate } from 'domain-model'
import Link from 'next/link'
import React from 'react'

import { PAGES } from '../helpers/routes'

export const TransactionPreviewCard: React.FC<Transaction> = ({
    id,
    date,
    category,
    origin,
    amount,
    currency,
    receiptId,
    taxRelevant,
    tags,
}) => {
    return (
        <Link href={PAGES.transactions.edit(id!)} key={id}>
            <div className="flex w-full flex-col gap-1 rounded-md border bg-background-overlay px-3 py-2 text-sm font-medium text-primary">
                <div className="flex w-full justify-between">
                    <p className="w-[200px] truncate">{origin}</p>
                    <p className="block w-1/3 text-right">
                        {`${amount} ${currency}`}
                    </p>
                </div>
                <div className="flex w-full justify-between">
                    <p>{`${category} on ${formatDate(date)}`}</p>
                    <p>
                        {taxRelevant() && <>🤓</>}
                        {receiptId && <>📄</>}
                        {tags.length > 0 && <>#️⃣</>}
                    </p>
                </div>
            </div>
        </Link>
    )
}
