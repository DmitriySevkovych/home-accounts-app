import {
    TransactionAggregate,
    TransactionAggregationBin,
    getMonthDifference,
} from 'domain-model'
import React, { useState } from 'react'
import useSWR from 'swr'

import { Loader, SectionHeading } from '../../components/Typography'
import CashflowBalance from '../../components/cashflow/CashflowBalance'
import CashflowIncome from '../../components/cashflow/CashflowIncome'
import CashflowTimeRangeManager, {
    CashflowTimeRange,
    getDefaultTimeRange,
} from '../../components/cashflow/CashflowTimeRangeManager'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'

const _fetchTransactionAggregates = async (
    url: string,
    timeRange: CashflowTimeRange
): Promise<TransactionAggregationBin> => {
    const res = await safeFetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ timeRange }),
    })
    const { aggregationBins } = await res.json()
    return {
        timeRange: {
            from: new Date(aggregationBins[0].timeRange.from),
            until: new Date(aggregationBins[0].timeRange.until),
        },
        aggregates: aggregationBins[0].aggregates.map(
            (i: any) =>
                ({
                    ...i,
                    amount: parseInt(i.amount),
                }) satisfies TransactionAggregate
        ),
    }
}

const CashflowAnalysisPage: React.FC = () => {
    // Local state
    const [timeRange, setTimeRange] = useState<CashflowTimeRange>(
        getDefaultTimeRange()
    )

    // Queried data
    const { data, error, isLoading } = useSWR(
        [API.client.analysis.aggregation, timeRange],
        ([url, timeRange]) => _fetchTransactionAggregates(url, timeRange)
    )

    // Computed values
    const monthsConsidered = getMonthDifference(
        timeRange.from,
        timeRange.until,
        'round'
    )

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
                {isLoading ? (
                    <Loader />
                ) : (
                    <CashflowIncome
                        monthsConsidered={monthsConsidered}
                        aggregates={data!.aggregates}
                    />
                )}
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
            <section>
                {isLoading ? (
                    <Loader />
                ) : (
                    <CashflowBalance
                        monthsConsidered={monthsConsidered}
                        aggregates={data!.aggregates}
                    />
                )}
            </section>
        </PageWithBackButton>
    )
}

export default CashflowAnalysisPage
