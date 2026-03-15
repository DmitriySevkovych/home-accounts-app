import {
    Transaction,
    TransactionContext,
    deserializeTransaction,
} from 'domain-model'
import React, { useState } from 'react'
import useSWR, { Fetcher } from 'swr'

import { safeFetch } from '../helpers/requests'
import { ScrollArea } from '../lib/shadcn/ScrollArea'
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select as ShadcnSelect,
} from '../lib/shadcn/Select'
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

    const [showOwner, setShowOwner] = useState<string>('Everyone')

    const {
        data: rawTransactions,
        error,
        isLoading,
    } = useSWR([context], ([context]) =>
        _fetchTransactions(`/api/v1/transactions?context=${context}`)
    )

    const transactions = rawTransactions?.filter((t) =>
        context === 'work' && showOwner !== 'Everyone'
            ? t.ownedBy === showOwner
            : true
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
            <TabsContent value={context} className="flex flex-col gap-2">
                <SectionHeading>Latest {context} transactions</SectionHeading>

                {context === 'work' && (
                    <div>
                        <ShadcnSelect
                            value={showOwner}
                            onValueChange={setShowOwner}
                        >
                            <div className="flex items-baseline gap-2">
                                <p>Show transactions of </p>
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue />
                                </SelectTrigger>
                            </div>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Ivanna">
                                        Ivanna
                                    </SelectItem>
                                    <SelectItem value="Dmitriy">
                                        Dmitriy
                                    </SelectItem>
                                    <SelectItem value="Everyone">
                                        Everyone
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </ShadcnSelect>
                    </div>
                )}

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
