import {
    SearchParameters,
    Transaction,
    deserializeTransaction,
} from 'domain-model'
import React from 'react'
import useSWR from 'swr'

import { SectionHeading } from '../../components/Typography'
import CashflowBalance from '../../components/cashflow/CashflowBalance'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'

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
