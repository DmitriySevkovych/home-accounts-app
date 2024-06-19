import {
    Transaction,
    TransactionContext,
    deserializeTransaction,
} from 'domain-model'
import React, { useState } from 'react'
import useSWR, { Fetcher } from 'swr'

import { safeFetch } from '../helpers/requests'
import { API } from '../helpers/routes'
import { ScrollArea } from '../lib/shadcn/ScrollArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lib/shadcn/Tabs'
import { TransactionPreviewCard } from './TransactionPreviewCard'
import { TodaysTotal } from './TransactionsTodaysTotal'
import { ErrorMessage, Loader, SectionHeading } from './Typography'

const _fetchTransactions: Fetcher<Transaction[], string> = async (
    url: string
) => {
    const request = await safeFetch(url)
    const data = await request.json()
    return data.map((obj: any) => deserializeTransaction(obj))
}

export const TransactionsPreview = () => {
    const [context, setContext] = useState<TransactionContext>('home')

    const {
        data: transactions,
        error,
        isLoading,
    } = useSWR([context], ([context]) =>
        _fetchTransactions(API.client.transactions.get(context))
    )

    return (
        <Tabs
            defaultValue={context}
            onValueChange={(value: string) => {
                setContext(value as TransactionContext)
            }}
        >
            <TabsList className="w-full bg-inherit">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
            </TabsList>
            <TabsContent value={context}>
                <SectionHeading>Latest {context} transactions</SectionHeading>

                {error ? <ErrorMessage error={error} /> : null}

                <ScrollArea className="h-[190px]">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        transactions?.map((t) => (
                            <TransactionPreviewCard
                                key={t.id}
                                transaction={t}
                            />
                        ))
                    )}
                </ScrollArea>

                {transactions && <TodaysTotal transactions={transactions} />}
            </TabsContent>
        </Tabs>
    )
}
