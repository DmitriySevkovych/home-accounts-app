import { TransactionAggregate } from 'domain-model'
import React from 'react'

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
    return (
        <div className="grid grid-cols-[75fr_25fr]">
            <div>{label}</div>
            <div className="text-right">{`${Math.abs(Math.round(amount / monthsConsidered))}€`}</div>
        </div>
    )
}

type CashflowExpensesProps = {
    monthsConsidered: number
    aggregates: TransactionAggregate[]
}

const _sumUp = (aggregates: TransactionAggregate[]) =>
    aggregates.reduce((total, aggregate) => total + aggregate.amount, 0)

const CashflowExpenses: React.FC<CashflowExpensesProps> = ({
    monthsConsidered,
    aggregates,
}) => {
    // Computed values
    let expenses = aggregates.filter((agg) => agg.type === 'expense')

    const taxes = expenses.filter((exp) => exp.category === 'TAX')
    const taxHome = taxes.filter((exp) => exp.context === 'home')
    const taxWork = taxes.filter((exp) => exp.context === 'work')
    const taxInvestments = taxes.filter((exp) => exp.context === 'investments')
    expenses = expenses.filter((exp) => !taxes.includes(exp))

    const biegelExpenses = expenses.filter((exp) => exp.investment === 'Biegel')
    const biegelInstalments = biegelExpenses.filter(
        (exp) => exp.category == 'INSTALMENT'
    )
    const otherBiegelExpenses = biegelExpenses.filter(
        (exp) => !biegelInstalments.includes(exp)
    )
    expenses = expenses.filter((exp) => !biegelExpenses.includes(exp))

    const privateExpenses = expenses.filter((exp) => exp.context === 'home')
    const food = privateExpenses.filter((exp) => exp.category === 'FOOD')
    const household = privateExpenses.filter(
        (exp) => exp.category === 'HOUSEHOLD'
    )
    const medicine = privateExpenses.filter(
        (exp) => exp.category === 'MEDICINE'
    )
    const vacation = privateExpenses.filter(
        (exp) => exp.category === 'VACATION'
    )
    const leisure = privateExpenses.filter((exp) => exp.category === 'LEISURE')
    const otherPrivateExpenses = privateExpenses.filter(
        (exp) =>
            ![
                ...food,
                ...household,
                ...medicine,
                ...vacation,
                ...leisure,
            ].includes(exp)
    )
    expenses = expenses.filter((exp) => !privateExpenses.includes(exp))

    const workExpenses = expenses.filter((exp) => exp.context === 'work')
    expenses = expenses.filter((exp) => !workExpenses.includes(exp))

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
                                    label="Home Mortgate🌽🏠"
                                    amount={_sumUp(biegelExpenses)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Bank instalments"
                                amount={_sumUp(biegelInstalments)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Other"
                                amount={_sumUp(otherBiegelExpenses)}
                                monthsConsidered={monthsConsidered}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Private"
                                    amount={_sumUp(privateExpenses)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Food"
                                amount={_sumUp(food)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Household"
                                amount={_sumUp(household)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Medicine"
                                amount={_sumUp(medicine)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Vacation"
                                amount={_sumUp(vacation)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Leisure"
                                amount={_sumUp(leisure)}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Other"
                                amount={_sumUp(otherPrivateExpenses)}
                                monthsConsidered={monthsConsidered}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Work"
                                    amount={_sumUp(workExpenses)}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
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
                            <ExpenseItem
                                label="Other"
                                amount={_sumUp(otherInvestmentExpenses)}
                                monthsConsidered={monthsConsidered}
                            />
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
