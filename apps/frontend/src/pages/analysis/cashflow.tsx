import {
    TransactionAggregate,
    TransactionAggregationBin,
    getMonthDifference,
} from 'domain-model'
import React, { useState } from 'react'
import useSWR from 'swr'

import { Loader, SectionHeading } from '../../components/Typography'
import CashflowBalance from '../../components/cashflow/CashflowBalance'
import CashflowExpenses from '../../components/cashflow/CashflowExpenses'
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
            className="relative flex h-full flex-col justify-between"
            stickyButton={
                <div className="sticky bottom-0 right-0 place-self-end pb-6">
                    <CashflowTimeRangeManager
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                    />
                </div>
            }
        >
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
                {isLoading ? (
                    <Loader />
                ) : (
                    <CashflowExpenses
                        monthsConsidered={monthsConsidered}
                        aggregates={data!.aggregates}
                    />
                )}
            </section>

            {/* Assets summary */}
            <section>
                <SectionHeading>Assets</SectionHeading>
            </section>

            {/* Liabilities summary */}
            <section>
                <SectionHeading>Liabilities</SectionHeading>
            </section>
        </PageWithBackButton>
    )
}

export default CashflowAnalysisPage
