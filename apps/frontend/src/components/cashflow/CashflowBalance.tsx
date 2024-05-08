import {
    TimeRange,
    TransactionAggregate,
    getMonthDifference,
} from 'domain-model'
import { Equal, Minus, Plus } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '../Typography'

type CashflowBalanceProps = {
    timeRange: TimeRange
    aggregates: TransactionAggregate[]
}

const _toActiveIncome = (a: TransactionAggregate) =>
    a.type === 'income' && a.context !== 'investments' ? a.amount : 0
const _toPassiveIncome = (a: TransactionAggregate) =>
    a.type === 'income' && a.context === 'investments' ? a.amount : 0
const _toTotalExpenses = (a: TransactionAggregate) =>
    a.type === 'expense' ? a.amount : 0
const _sumUp = (a: number, b: number) => a + b

const CashflowBalance: React.FC<CashflowBalanceProps> = ({
    timeRange,
    aggregates,
}) => {
    // Computed values
    const monthsConsidered = getMonthDifference(
        timeRange.from,
        timeRange.until,
        'round'
    )
    const activeIncome =
        aggregates.map(_toActiveIncome).reduce(_sumUp) / monthsConsidered
    const passiveIncome =
        aggregates.map(_toPassiveIncome).reduce(_sumUp) / monthsConsidered
    const totalExpenses =
        (-1 * aggregates.map(_toTotalExpenses).reduce(_sumUp)) /
        monthsConsidered

    // Render
    return (
        <>
            <SectionHeading>Cashflow</SectionHeading>

            <p className="text-primary">
                Average values over {monthsConsidered} months
            </p>

            <div className="flex flex-col items-center gap-2">
                <CashflowItem label="Active income" amount={activeIncome} />

                <Plus size={24} className="text-primary" />

                <CashflowItem label="Passive income" amount={passiveIncome} />

                <Equal size={24} className="text-primary" />

                <CashflowItem
                    label="Total income"
                    amount={activeIncome + passiveIncome}
                />

                <Minus size={24} className="text-primary" />

                <CashflowItem label="Total expenses" amount={totalExpenses} />

                <Equal size={24} className="text-primary" />

                <CashflowItem
                    label="Monthly cashflow"
                    amount={activeIncome + passiveIncome - totalExpenses}
                />
            </div>
        </>
    )
}

const CashflowItem: React.FC<{ label: string; amount: number }> = ({
    label,
    amount,
}) => {
    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl">{Math.round(amount)}</div>
            <div className="text-xs text-primary">{label}</div>
        </div>
    )
}

export default CashflowBalance
