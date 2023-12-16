import {
    Transaction,
    TransactionContext,
    deserializeTransaction,
} from 'domain-model'
import Link from 'next/link'
import React, { Suspense, useEffect, useState } from 'react'

import OverlayImage from '../../components/Overlay'
import { SystemInfo, SystemInfoFooter } from '../../components/SystemInfoFooter'
import { TransactionPreviewCard } from '../../components/TransactionPreviewCard'
import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'
import { ScrollArea } from '../../lib/shadcn/ScrollArea'

type TransactionsPageProps = {
    systemInfo: SystemInfo
}

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

const TransactionsPage = ({ systemInfo }: TransactionsPageProps) => {
    const context = 'home'
    const limit = 25

    const transactions = useLatestTransactions(context, limit)

    return (
        <>
            <div className="relative flex h-full w-full flex-col justify-between p-4">
                <div className="flex flex-grow flex-col items-center justify-between gap-10">
                    <h1 className="mt-24 text-center text-xl font-bold text-primary lg:text-2xl">
                        Posipaki Home Accounts App: Transactions
                    </h1>
                    <div className="flex w-full flex-col gap-1">
                        <h1 className="text-md font-bold text-primary lg:text-xl">
                            Latest
                        </h1>
                        <Suspense fallback={<p>Loading...</p>}>
                            <ScrollArea className="h-[190px]">
                                {transactions.map((t) => (
                                    <TransactionPreviewCard key={t.id} {...t} />
                                ))}
                            </ScrollArea>
                        </Suspense>
                    </div>

                    <Link className="w-full" href={PAGES.transactions.new}>
                        <Button className="w-full" variant="primary">
                            New
                        </Button>
                    </Link>
                </div>
                <OverlayImage />
                {systemInfo.frontend.environment !== 'production' && (
                    <SystemInfoFooter {...systemInfo} />
                )}
            </div>
        </>
    )
}

export const getServerSideProps = async () => {
    let backendInfo
    try {
        const req = await safeFetch(API.server.system.info())
        backendInfo = await req.json()
    } catch (err) {
        backendInfo = {
            error: `Fetch ${API.server.system.info()} failed`,
        }
        console.error(err)
    }
    return {
        props: {
            systemInfo: {
                frontend: {
                    environment: process.env['APP_ENV'],
                    branch: process.env['GIT_BRANCH']
                        ? process.env['GIT_BRANCH']
                        : '',
                    commit: process.env['GIT_COMMIT']
                        ? process.env['GIT_COMMIT']
                        : '',
                },
                backend: backendInfo,
            },
        },
    }
}

export default TransactionsPage
