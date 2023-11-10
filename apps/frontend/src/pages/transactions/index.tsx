import {
    Transaction,
    TransactionContext,
    deserializeTransaction,
} from 'domain-model'
import Link from 'next/link'
import React, { Suspense, useEffect, useState } from 'react'

import OverlayImage from '../../components/Overlay'
import { SystemInfo, SystemInfoFooter } from '../../components/SystemInfoFooter'
import {
    CLIENT_BACKEND_BASE_URL,
    SERVER_BACKEND_BASE_URL,
} from '../../helpers/constants'
import { PAGES } from '../../helpers/pages'
import { Button } from '../../lib/shadcn/Button'
import { ScrollArea } from '../../lib/shadcn/ScrollArea'

type TransactionsOverviewProps = {
    systemInfo: SystemInfo
}

const useLatestTransactions = (context: TransactionContext, limit: number) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    useEffect(() => {
        const fetchTransactions = async () => {
            const req = await fetch(
                `${CLIENT_BACKEND_BASE_URL}/transactions?context=${context}&limit=${limit}`
            )
            const reqData = await req.json()
            const fetchedTransactions = reqData.map((obj: any) =>
                deserializeTransaction(obj)
            )
            setTransactions(fetchedTransactions)
        }
        fetchTransactions()
    }, [context, limit])
    return transactions
}

const TransactionsOverview = ({ systemInfo }: TransactionsOverviewProps) => {
    const context = 'home'
    const limit = 5

    const transactions = useLatestTransactions(context, limit)

    return (
        <>
            <div className="relative flex h-full min-h-screen w-full flex-col justify-between p-4">
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
                                {transactions.map((transaction) => {
                                    const {
                                        id,
                                        date,
                                        origin,
                                        amount,
                                        currency,
                                        receiptId,
                                    } = transaction
                                    return (
                                        <Link
                                            href={PAGES.transactions.edit(id!)}
                                            key={id}
                                        >
                                            <div className="flex w-full flex-col gap-1 rounded-md border bg-background-overlay px-3 py-2 text-sm font-medium text-primary">
                                                <div className="flex w-full justify-between">
                                                    <p className="w-[200px] truncate">
                                                        {origin}
                                                    </p>
                                                    <p className="block w-1/3 text-right">
                                                        {`${amount} ${currency}`}
                                                    </p>
                                                </div>
                                                <div className="flex w-full justify-between">
                                                    <p>{date.toWords()}</p>
                                                    {receiptId && <p>📄</p>}
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </ScrollArea>
                        </Suspense>
                    </div>
                    <Button className="w-full" variant="primary">
                        <Link href={PAGES.transactions.new}>New</Link>
                    </Button>
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
        const req = await fetch(`${SERVER_BACKEND_BASE_URL}/system/info`)
        backendInfo = await req.json()
    } catch (err) {
        backendInfo = {
            error: `Fetch ${SERVER_BACKEND_BASE_URL} failed`,
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
                    tlsRejectUnauthorized:
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] !== '0',
                },
                backend: backendInfo,
            },
        },
    }
}

export default TransactionsOverview
