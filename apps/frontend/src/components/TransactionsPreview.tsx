import {
    Transaction,
    TransactionContext,
    deserializeTransaction,
} from 'domain-model'
import React, { Suspense, useEffect, useState } from 'react'

import { safeFetch } from '../helpers/requests'
import { API } from '../helpers/routes'
import { ScrollArea } from '../lib/shadcn/ScrollArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lib/shadcn/Tabs'
import { TransactionPreviewCard } from './TransactionPreviewCard'

const useLatestTransactions = (context: TransactionContext, limit: number) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    useEffect(() => {
        const fetchTransactions = async () => {
            const req = await safeFetch(
                API.client.transactions.get(context, limit)
            )
            const reqData = await req.json()
            const fetchedTransactions = reqData.map((obj: any) =>
                deserializeTransaction(obj)
            )
            setTransactions(fetchedTransactions)
        }
        fetchTransactions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context, limit])
    return transactions
}

export const TransactionsPreview = () => {
    const [context, setContext] = useState<TransactionContext>('home')
    const limit = 25

    const transactions = useLatestTransactions(context, limit)
    return (
        <Tabs
            defaultValue={context}
            onValueChange={(value: string) => {
                setContext(value as TransactionContext)
            }}
        >
            <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
            </TabsList>
            <TabsContent value={context}>
                <h1 className="text-md font-bold text-primary lg:text-xl">
                    Latest {context} transactions
                </h1>
                <Suspense fallback={<p>Loading...</p>}>
                    <ScrollArea className="h-[190px]">
                        {transactions.map((t) => (
                            <TransactionPreviewCard key={t.id} {...t} />
                        ))}
                    </ScrollArea>
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}
