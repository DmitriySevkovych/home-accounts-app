import { TransactionAggregate } from 'domain-model'
import React, { useState } from 'react'
import useSWR from 'swr'

import { Loader } from '../../components/Typography'
import CashflowTimeRangeManager, {
    CashflowTimeRange,
    getDefaultTimeRange,
} from '../../components/cashflow/CashflowTimeRangeManager'
import AggregationAreaChart from '../../components/charts/AggregationAreaChart'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'

const _fetchMonthlyTransactionAggregates = async (
    url: string,
    timeRange: CashflowTimeRange
): Promise<TransactionAggregate[]> => {
    const res = await safeFetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ timeRange, groupByMonth: true }),
    })
    const { aggregates } = await res.json()
    return aggregates.map(
        (i: any) =>
            ({
                ...i,
                timeRange: {
                    from: new Date(i.timeRange.from),
                    until: new Date(i.timeRange.until),
                },
                amount: parseInt(i.amount),
            }) satisfies TransactionAggregate
    )
}

const TransactionsPage = () => {
    // Local state
    const [timeRange, setTimeRange] = useState<CashflowTimeRange>(
        getDefaultTimeRange()
    )

    // Queried data
    const {
        data: aggregates,
        error,
        isLoading,
    } = useSWR(
        [API.client.analysis.aggregation, timeRange],
        ([url, timeRange]) => _fetchMonthlyTransactionAggregates(url, timeRange)
    )

    return (
        <PageWithBackButton
            heading="Monthly chart"
            goBackLink={PAGES.home}
            className="flex h-full flex-col justify-between"
            stickyButton={
                <div className="sticky bottom-0 right-0 place-self-end pb-6">
                    <CashflowTimeRangeManager
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                    />
                </div>
            }
        >
            {isLoading ? (
                <Loader />
            ) : (
                <AggregationAreaChart aggregates={aggregates!} />
            )}
        </PageWithBackButton>
    )
}

export default TransactionsPage
