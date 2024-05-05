import {
    SearchParameters,
    Transaction,
    deserializeTransaction,
} from 'domain-model'
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'

import { SectionHeading } from '../../components/Typography'
import CashflowBalance from '../../components/cashflow/CashflowBalance'
import CashflowTimeRangeManager, {
    CashflowTimeRange,
    getDefaultTimeRange,
} from '../../components/cashflow/CashflowTimeRangeManager'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'

const fetcher = (url: string, timeRange: CashflowTimeRange) => {
    return safeFetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            parameters: {
                searchCombination: 'and',
                dateFrom: timeRange.from,
                dateUntil: timeRange.until,
            },
        }),
    }).then((res) => res.json())
}

const CashflowAnalysisPage: React.FC = () => {
    // Local state
    const [timeRange, setTimeRange] = useState<CashflowTimeRange>(
        getDefaultTimeRange()
    )

    // Queried data
    const { data, error, isLoading } = useSWR(
        [API.client.transactions.search({ forceFetchAll: true }), timeRange],
        ([url, timeRange]) => fetcher(url, timeRange)
    )

    // Values computed from queried data
    const transactions = isLoading
        ? []
        : data.transactions.map((t: Transaction) => deserializeTransaction(t))
    console.log({ timeRange, transactions, error, isLoading })

    // Render
    return (
        <PageWithBackButton
            heading="Cashflow Analysis"
            goBackLink={PAGES.home}
            className="flex h-full flex-col justify-between"
        >
            {/* Time range parameters */}
            <CashflowTimeRangeManager
                timeRange={timeRange}
                setTimeRange={setTimeRange}
            />

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
