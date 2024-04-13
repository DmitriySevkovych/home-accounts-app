import { Transaction, formatDate } from 'domain-model'
import Link from 'next/link'
import React from 'react'

import { PAGES } from '../helpers/routes'

type TransactionPreviewCardProps = {
    transaction: Transaction
}

const _warningSign = (transaction: Transaction): string => {
    const { exchangeRateWarning, cashWarning } = transaction
    if (exchangeRateWarning() || cashWarning()) return '⚠️'

    return ''
}

const _previewDetails = (transaction: Transaction): string => {
    const { category, date, agent } = transaction
    if (agent.includes('cron')) return `🤖 ${category} on ${formatDate(date)}`
    return `${category} on ${formatDate(date)}`
}

export const TransactionPreviewCard: React.FC<TransactionPreviewCardProps> = ({
    transaction,
}) => {
    const { id, origin, amount, currency, receiptId, taxRelevant, tags } =
        transaction
    return (
        <Link href={PAGES.transactions.edit(id!)} key={id}>
            <div className="mb-1 flex w-full flex-col gap-1 rounded-md border bg-background-overlay px-3 py-2 text-sm font-medium text-primary">
                <div className="flex w-full justify-between">
                    <p className="w-[200px] truncate">{`${_warningSign(transaction)} ${origin}`}</p>
                    <p className="block w-1/3 text-right">
                        {`${amount} ${currency}`}
                    </p>
                </div>
                <div className="flex w-full justify-between">
                    <p>{_previewDetails(transaction)}</p>
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
