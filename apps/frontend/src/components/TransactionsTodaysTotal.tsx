import { DateCheck, Transaction } from 'domain-model'
import React from 'react'

type TodaysTotalProps = {
    transactions: Transaction[]
}

export const TodaysTotal: React.FC<TodaysTotalProps> = ({ transactions }) => {
    const todaysTotal = transactions?.reduce((sum, t) => {
        if (DateCheck.today().isSameDayAs(t.date)) {
            return sum + t.eurEquivalent()
        }
        return sum
    }, 0)

    if (todaysTotal === 0) return null

    return (
        <div className="w-full pt-2 text-right">
            Today&apos;s total: {todaysTotal} EUR
        </div>
    )
}
