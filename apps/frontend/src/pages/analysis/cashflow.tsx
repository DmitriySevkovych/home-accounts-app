import {
    SearchParameters,
    Transaction,
    deserializeTransaction,
} from 'domain-model'
import React, { useState } from 'react'
import useSWR from 'swr'

import { CalendarStandalone } from '../../components/Calendar'
import { SectionHeading } from '../../components/Typography'
import CashflowBalance from '../../components/cashflow/CashflowBalance'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../lib/shadcn/Accordion'
import { Label } from '../../lib/shadcn/Label'
import { RadioGroup, RadioGroupItem } from '../../lib/shadcn/Radio'

const fetcher = (url: string, parameters: SearchParameters) => {
    return safeFetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ parameters }),
    }).then((res) => res.json())
}

const CashflowAnalysisPage: React.FC = () => {
    // Local state
    const [timeRange, setTimeRange] = useState<string>('last-three-months')
    const parameters: SearchParameters = {
        searchCombination: 'and',
        dateFrom: new Date('2024-01-01'),
    }

    // Queried data
    const { data, error, isLoading } = useSWR(
        [API.client.transactions.search({ forceFetchAll: true }), parameters],
        ([url, parameters]) => fetcher(url, parameters)
    )

    // Values computed from queried data
    const transactions = isLoading
        ? []
        : data.transactions.map((t: Transaction) => deserializeTransaction(t))
    console.log({ transactions, error, isLoading })

    // Render
    return (
        <PageWithBackButton
            heading="Cashflow Analysis"
            goBackLink={PAGES.home}
            className="flex h-full flex-col justify-between"
        >
            {/* Time range parameters */}
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <SectionHeading>Time range</SectionHeading>
                    </AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup
                            value={timeRange}
                            onValueChange={setTimeRange}
                        >
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem
                                    value="last-three-months"
                                    id="last-three-months"
                                />
                                <Label
                                    className="font-normal"
                                    htmlFor="last-three-months"
                                >
                                    Last three months
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem
                                    value="last-year"
                                    id="last-year"
                                />
                                <Label
                                    className="font-normal"
                                    htmlFor="last-year"
                                >
                                    Last year
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem
                                    value="current-year"
                                    id="current-year"
                                />
                                <Label
                                    className="font-normal"
                                    htmlFor="current-year"
                                >
                                    Current year
                                </Label>
                            </div>
                            <div className="flex items-start space-x-3">
                                <RadioGroupItem
                                    value="custom-dates"
                                    id="custom-dates"
                                />
                                <Label
                                    className="flex w-full space-x-4 font-normal"
                                    htmlFor="custom-dates"
                                >
                                    <div className="flex flex-grow flex-col space-y-2">
                                        <span>from</span> <CalendarStandalone />
                                    </div>
                                    <div className="flex flex-grow flex-col space-y-2">
                                        <span>until</span>
                                        <CalendarStandalone />
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Income summary */}
            <section>
                <SectionHeading>Income</SectionHeading>
            </section>

            {/* Expense summary */}
            <section>
                <SectionHeading>Expenses</SectionHeading>
            </section>

            {/* Assets summary */}
            <section>
                <SectionHeading>Assets</SectionHeading>
            </section>

            {/* Liabilities summary */}
            <section>
                <SectionHeading>Liabilities</SectionHeading>
            </section>

            {/* Total cashflow result */}
            <CashflowBalance
                activeIncome={12500}
                passiveIncome={4700}
                totalExpenses={14526}
            />
        </PageWithBackButton>
    )
}

export default CashflowAnalysisPage
