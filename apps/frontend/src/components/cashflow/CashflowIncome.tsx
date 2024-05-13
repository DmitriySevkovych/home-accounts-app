import {
    TimeRange,
    TransactionAggregate,
    getMonthDifference,
} from 'domain-model'
import React from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../lib/shadcn/Accordion'
import { Label } from '../../lib/shadcn/Label'
import { SectionHeading } from '../Typography'

type IncomeItemProps = {
    item: TransactionAggregate
    monthsConsidered: number
}

const IncomeItem: React.FC<IncomeItemProps> = ({ item, monthsConsidered }) => {
    const { category, investment, origin, amount } = item
    return (
        <div className="grid grid-cols-[75fr_25fr]">
            <div className="capitalize">{`${investment ? investment : origin} ${category.toLowerCase()}`}</div>
            <div className="text-right">{`${Math.round(amount / monthsConsidered)}€`}</div>
        </div>
    )
}

type CashflowIncomeProps = {
    monthsConsidered: number
    aggregates: TransactionAggregate[]
}

const CashflowIncome: React.FC<CashflowIncomeProps> = ({
    monthsConsidered,
    aggregates,
}) => {
    // Computed values
    const incomes = aggregates
        .filter((a) => a.type === 'income')
        .sort((a, b) => b.amount - a.amount)

    const activeIncome = incomes.filter((i) =>
        ['SALARY', 'SALE'].includes(i.category)
    )

    const passiveIncomeGroupedByInvestment = incomes
        .filter((i) => !activeIncome.includes(i))
        .reduce(
            (
                result: { [_: string]: TransactionAggregate },
                item: TransactionAggregate,
                index: number
            ) => {
                // If the reduced item has no investment key, use its index instead (no reducing is necessary then)
                const investment = item.investment || index.toString()

                // If an entry for this investment already exists, update its values...
                if (result[investment]) {
                    const { amount, category, origin } = result[investment]
                    result[investment] = {
                        ...result[investment],
                        amount: amount + item.amount,
                        category: category.includes(item.category)
                            ? category
                            : `${category}, ${item.category}`,
                        origin: `${origin}, ${item.origin}`,
                    }
                } else {
                    // ...otherwise create a new entry for this investment
                    result[investment] = item
                }
                return result
            },
            {}
        )

    const passiveIncome = Object.values(passiveIncomeGroupedByInvestment).sort(
        (a, b) => b.amount - a.amount
    )

    // Render
    return (
        <>
            <Accordion type="single" collapsible>
                <AccordionItem value="cashflow-income">
                    <AccordionTrigger className="pb-0 pt-2">
                        <SectionHeading>Time Income</SectionHeading>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <div>
                            <Label className="my-2 block">Active Income</Label>
                            {activeIncome.map((item) => (
                                <IncomeItem
                                    key={`${item.type}-${item.context}-${item.category}-${item.origin}`}
                                    item={item}
                                    monthsConsidered={monthsConsidered}
                                />
                            ))}
                        </div>
                        <div>
                            <Label className="mb-2 block">Passive Income</Label>
                            {passiveIncome.map((item) => (
                                <IncomeItem
                                    key={`${item.type}-${item.context}-${item.category}-${item.origin}`}
                                    item={item}
                                    monthsConsidered={monthsConsidered}
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default CashflowIncome
