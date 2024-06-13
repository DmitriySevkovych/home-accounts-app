import { TransactionAggregate } from 'domain-model'
import { ArrowBigDown, Equal, Minus, Plus } from 'lucide-react'
import React from 'react'

import { cn } from '../../helpers/utils'
import { SectionHeading } from '../Typography'

const CashflowItem: React.FC<{ label: string; amount: number }> = ({
    label,
    amount,
}) => {
    const textColor = amount < 0 ? 'text-destructive' : ''
    return (
        <div className={'flex flex-col items-center'}>
            <div className={cn('text-xl', textColor)}>{Math.round(amount)}</div>
            <div className="text-xs text-primary">{label}</div>
        </div>
    )
}

type CashflowBalanceProps = {
    monthsConsidered: number
    aggregates: TransactionAggregate[]
}

const activeIncomeCategories = ['SALARY', 'SALE']

const _toActiveIncome = (a: TransactionAggregate) =>
    a.type === 'income' && activeIncomeCategories.includes(a.category)
        ? a.amount
        : 0
const _toPassiveIncome = (a: TransactionAggregate) =>
    a.type === 'income' && !activeIncomeCategories.includes(a.category)
        ? a.amount
        : 0
const _toTotalExpenses = (a: TransactionAggregate) =>
    a.type === 'expense' ? a.amount : 0
const _sumUp = (a: number, b: number) => a + b

const CashflowBalance: React.FC<CashflowBalanceProps> = ({
    monthsConsidered,
    aggregates,
}) => {
    // Computed values
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
                Monthly averages for the last {monthsConsidered} months
            </p>

            <div className="flex flex-col items-center gap-4 pb-6 pt-4">
                <div className="grid grid-cols-[30fr_5fr_30fr_5fr_30fr] items-center justify-center">
                    <CashflowItem label="Active income" amount={activeIncome} />

                    <Plus size={18} className="mx-auto mb-3 text-primary" />

                    <CashflowItem
                        label="Passive income"
                        amount={passiveIncome}
                    />

                    <Equal size={18} className="mx-auto  mb-3 text-primary" />

                    <CashflowItem
                        label="Total income"
                        amount={activeIncome + passiveIncome}
                    />
                </div>

                <ArrowBigDown size={24} className="text-primary" />

                <div className="grid grid-cols-[30fr_5fr_30fr_5fr_30fr] items-center justify-center">
                    <CashflowItem
                        label="Total income"
                        amount={activeIncome + passiveIncome}
                    />

                    <Minus size={18} className="mx-auto mb-3 text-primary" />

                    <CashflowItem
                        label="Total expenses"
                        amount={totalExpenses}
                    />

                    <Equal size={18} className="mx-auto  mb-3 text-primary" />

                    <CashflowItem
                        label="Monthly cashflow"
                        amount={activeIncome + passiveIncome - totalExpenses}
                    />
                </div>
            </div>
        </>
    )
}

export default CashflowBalance
