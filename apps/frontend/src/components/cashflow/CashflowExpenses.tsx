import {
    TransactionAggregate,
    TransactionAggregateByOrigin,
} from 'domain-model'
import React from 'react'

import { cn } from '../../helpers/utils'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../lib/shadcn/Accordion'
import { Label } from '../../lib/shadcn/Label'
import { SectionHeading } from '../Typography'

type ExpenseItemProps = {
    label: string
    amount: number
    monthsConsidered: number
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
    label,
    amount,
    monthsConsidered,
}) => {
    const textColor = amount < 0 ? 'text-destructive' : ''
    const displayAmount = Math.abs(Math.round(amount / monthsConsidered))

    if (displayAmount === 0) return null

    return (
        <div className="grid grid-cols-[75fr_25fr]">
            <div className="capitalize">{label}</div>
            <div
                className={cn('text-right', textColor)}
            >{`${displayAmount}€`}</div>
        </div>
    )
}

type CashflowExpensesProps = {
    monthsConsidered: number
    aggregates: TransactionAggregateByOrigin[]
}

const _groupByCategory = (aggregates: TransactionAggregate[]) => {
    const expensesMap = aggregates.reduce((groupedExpenses, expense) => {
        const { category } = expense
        let updateAmount = expense.amount
        if (groupedExpenses.has(category)) {
            updateAmount = groupedExpenses.get(category) + updateAmount
        }
        groupedExpenses.set(category, updateAmount)

        return groupedExpenses
    }, new Map())
    return Array.from(expensesMap.entries()).sort((a, b) => a[1] - b[1])
}

const _sumUp = (aggregates: TransactionAggregate[]): number =>
    aggregates.reduce((total, aggregate) => total + aggregate.amount, 0)

const CashflowExpenses: React.FC<CashflowExpensesProps> = ({
    monthsConsidered,
    aggregates,
}) => {
    /* Computed values */
    let expenses = aggregates.filter((agg) => agg.type === 'expense')

    // Taxes
    const taxes = expenses.filter((exp) => exp.category === 'TAX')
    const taxHome = taxes.filter((exp) => exp.context === 'home')
    const taxWork = taxes.filter((exp) => exp.context === 'work')
    const taxInvestments = taxes.filter((exp) => exp.context === 'investments')
    expenses = expenses.filter((exp) => !taxes.includes(exp))

    // Home mortgage
    const homeMortgageExpenses = expenses.filter(
        (exp) => exp.investment === 'Biegel'
    )
    const homeMortgageInstalments = homeMortgageExpenses.filter(
        (exp) => exp.category == 'INSTALMENT'
    )
    const otherHomeMortgageExpenses = homeMortgageExpenses.filter(
        (exp) => !homeMortgageInstalments.includes(exp)
    )
    const otherHomeMortgageExpensesSums = _groupByCategory(
        otherHomeMortgageExpenses
    )
    expenses = expenses.filter((exp) => !homeMortgageExpenses.includes(exp))

    // Private
    const privateExpenses = expenses.filter((exp) => exp.context === 'home')
    const privateExpensesSums = _groupByCategory(privateExpenses)
    expenses = expenses.filter((exp) => !privateExpenses.includes(exp))

    // Work
    const workExpenses = expenses.filter((exp) => exp.context === 'work')
    const workExpensesSums = _groupByCategory(workExpenses)
    expenses = expenses.filter((exp) => !workExpenses.includes(exp))

    // Investments
    const investmentExpenses = expenses.filter(
        (exp) => exp.context === 'investments'
    )
    const investmentBankLoans = investmentExpenses.filter(
        (exp) => exp.category === 'INSTALMENT'
    )
    const investmentUtilities = investmentExpenses.filter((exp) =>
        [
            'FIM Immobilien',
            'Martin Kafka Hausverwaltung Gerlingen',
            'Kreis Hausverwaltung oHG',
            'Donhauser Immobilienverwaltungs GmbH',
        ].includes(exp.origin)
    )
    const otherInvestmentExpenses = investmentExpenses.filter(
        (exp) => ![...investmentBankLoans, ...investmentUtilities].includes(exp)
    )
    const otherInvestmentExpensesSums = _groupByCategory(
        otherInvestmentExpenses
    )
    expenses = expenses.filter((exp) => !investmentExpenses.includes(exp))

    // Render
    return (
        <>
            <Accordion type="single" collapsible>
                <AccordionItem value="cashflow-expenses">
                    <AccordionTrigger className="pb-0 pt-2">
                        <SectionHeading>Expenses</SectionHeading>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <div>
                            <Label className="my-2 block">
                                <ExpenseItem
                                    label="Taxes🧐"
                                    amount={_sumUp(taxes)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Home"
                                amount={_sumUp(taxHome)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Work"
                                amount={_sumUp(taxWork)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Investments"
                                amount={_sumUp(taxInvestments)}
                                monthsConsidered={monthsConsidered}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Home Mortgage🌽🏠"
                                    amount={_sumUp(homeMortgageExpenses)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Bank loan"
                                amount={_sumUp(homeMortgageInstalments)}
                                monthsConsidered={monthsConsidered}
                            />
                            {otherHomeMortgageExpensesSums.map((entry) => {
                                const [label, amount] = entry
                                return (
                                    <ExpenseItem
                                        key={`homeMortgageExpense-${label}`}
                                        label={label.toLowerCase()}
                                        amount={amount}
                                        monthsConsidered={monthsConsidered}
                                    />
                                )
                            })}
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Private"
                                    amount={_sumUp(privateExpenses)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            {privateExpensesSums.map((entry) => {
                                const [label, amount] = entry
                                return (
                                    <ExpenseItem
                                        key={`privateExpense-${label}`}
                                        label={label.toLowerCase()}
                                        amount={amount}
                                        monthsConsidered={monthsConsidered}
                                    />
                                )
                            })}
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Work"
                                    amount={_sumUp(workExpenses)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            {workExpensesSums.map((entry) => {
                                const [label, amount] = entry
                                return (
                                    <ExpenseItem
                                        key={`workExpense-${label}`}
                                        label={label.toLowerCase()}
                                        amount={amount}
                                        monthsConsidered={monthsConsidered}
                                    />
                                )
                            })}
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Investment"
                                    amount={_sumUp(investmentExpenses)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Bank loan"
                                amount={_sumUp(investmentBankLoans)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Utilities"
                                amount={_sumUp(investmentUtilities)}
                                monthsConsidered={monthsConsidered}
                            />
                            {otherInvestmentExpensesSums.map((entry) => {
                                const [label, amount] = entry
                                return (
                                    <ExpenseItem
                                        key={`investmentExpense-${label}`}
                                        label={label.toLowerCase()}
                                        amount={amount}
                                        monthsConsidered={monthsConsidered}
                                    />
                                )
                            })}
                        </div>
                        {_sumUp(expenses) > 0 && (
                            <div>
                                <Label className="mb-2 block">
                                    <ExpenseItem
                                        label="Uncategorized⚠️"
                                        amount={_sumUp(expenses)}
                                        monthsConsidered={monthsConsidered}
                                    />
                                </Label>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default CashflowExpenses
