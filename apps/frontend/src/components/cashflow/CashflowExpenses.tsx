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
            <div className="text-right">{`${Math.round(amount / monthsConsidered)}€`}</div>
        </div>
    )
}

type CashflowExpensesProps = {
    monthsConsidered: number
    aggregates: TransactionAggregate[]
}

const CashflowExpenses: React.FC<CashflowExpensesProps> = ({
    monthsConsidered,
    aggregates,
}) => {
    // Computed values
    const expenses = aggregates.filter((agg) => agg.type === 'expense')

    const sumTaxHome = expenses
        .filter((exp) => exp.category === 'TAX' && exp.context === 'home')
        .reduce((totalAmount, expense) => totalAmount + expense.amount, 0)
    const sumTaxWork = expenses
        .filter((exp) => exp.category === 'TAX' && exp.context === 'work')
        .reduce((totalAmount, expense) => totalAmount + expense.amount, 0)
    const sumTaxInvestments = expenses
        .filter(
            (exp) => exp.category === 'TAX' && exp.context === 'investments'
        )
        .reduce((totalAmount, expense) => totalAmount + expense.amount, 0)
    const totalTaxes = expenses
        .filter((exp) => exp.category === 'TAX')
        .reduce((totalAmount, expense) => totalAmount + expense.amount, 0)

    const biegelExpenses = expenses.filter(
        (exp) => exp.investment === 'Biegel' && exp.category !== 'TAX'
    )
    const biegelInstalments = biegelExpenses.filter(
        (exp) => exp.category == 'INSTALMENT'
    )
    const sumBiegelInstalments = biegelInstalments.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )

    const otherBiegelExpenses = biegelExpenses.filter(
        (exp) => !biegelInstalments.includes(exp)
    )
    const sumOtherBiegelExpenses = otherBiegelExpenses.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )

    const totalBiegelExpenses = biegelExpenses.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )

    const privateExpenses = expenses.filter(
        (exp) => exp.context === 'home' && exp.category !== 'TAX'
    )
    // FOOD
    const food = privateExpenses.filter((exp) => exp.category === 'FOOD')
    const sumFood = food.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )
    // HOUSEHOLD
    const household = privateExpenses.filter(
        (exp) => exp.category === 'HOUSEHOLD'
    )
    const sumHousehold = household.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )
    // MEDICINE
    const medicine = privateExpenses.filter(
        (exp) => exp.category === 'MEDICINE'
    )
    const sumMedicine = medicine.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )
    // VACATION
    const vacation = privateExpenses.filter(
        (exp) => exp.category === 'VACATION'
    )
    const sumVacation = vacation.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )
    // LEISURE
    const leisure = privateExpenses.filter((exp) => exp.category === 'LEISURE')
    const sumLeisure = leisure.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )
    // Other
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
    const sumOtherPrivateExpenses = otherPrivateExpenses.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )

    const totalPrivateExpenses = privateExpenses.reduce(
        (totalAmount, expense) => totalAmount + expense.amount,
        0
    )
    console.log({ privateExpenses })

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
                                    amount={totalTaxes}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Home"
                                amount={sumTaxHome}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Work"
                                amount={sumTaxWork}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Investments"
                                amount={sumTaxInvestments}
                                monthsConsidered={monthsConsidered}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Home Mortgate🌽🏠"
                                    amount={totalBiegelExpenses}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Bank instalments"
                                amount={sumBiegelInstalments}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Other"
                                amount={sumOtherBiegelExpenses}
                                monthsConsidered={monthsConsidered}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">
                                <ExpenseItem
                                    label="Private Expenses"
                                    amount={totalPrivateExpenses}
                                    monthsConsidered={monthsConsidered}
                                />
                            </Label>
                            <ExpenseItem
                                label="Food"
                                amount={sumFood}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Household"
                                amount={sumHousehold}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Medicine"
                                amount={sumMedicine}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Vacation"
                                amount={sumVacation}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Leisure"
                                amount={sumLeisure}
                                monthsConsidered={monthsConsidered}
                            />
                            <ExpenseItem
                                label="Other"
                                amount={sumOtherPrivateExpenses}
                                monthsConsidered={monthsConsidered}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default CashflowExpenses
