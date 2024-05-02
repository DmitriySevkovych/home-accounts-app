import { Equal, Minus, Plus } from 'lucide-react'
import React from 'react'

import { SectionHeading } from '../Typography'

type CashflowBalanceProps = {
    activeIncome: number
    passiveIncome: number
    totalExpenses: number
}

const CashflowBalance: React.FC<CashflowBalanceProps> = ({
    activeIncome,
    passiveIncome,
    totalExpenses,
}) => {
    return (
        <section>
            <SectionHeading>Cashflow</SectionHeading>
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
        </section>
    )
}

const CashflowItem: React.FC<{ label: string; amount: number }> = ({
    label,
    amount,
}) => {
    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl">{amount}</div>
            <div className="text-xs text-primary">{label}</div>
        </div>
    )
}

export default CashflowBalance
