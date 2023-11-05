import { HomeAppDate } from 'domain-model'
import Link from 'next/link'
import React from 'react'

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

const transactionsData = [
    {
        type: 'expense',
        context: 'home',
        category: 'FOOD',
        origin: 'Lidl Schorndorf',
        description: 'Avocado',
        date: {
            datetime: '2023-11-05T01:00:00.000+01:00',
        },
        amount: -123,
        currency: 'EUR',
        exchangeRate: 1,
        paymentMethod: 'EC',
        targetBankAccount: 'HOME_ACCOUNT',
        tags: ['1'],
        agent: 'home-app-frontend',
    },
    {
        type: 'expense',
        context: 'home',
        category: 'FEE',
        origin: 'Test 2 dadsgagggggggggggggggggggggggggggggggfgvhhhhhhhhhhh sdfffffffffffg',
        date: {
            datetime: '2023-11-05T01:00:00.000+01:00',
        },
        amount: -456,
        currency: 'EUR',
        exchangeRate: 1,
        paymentMethod: 'EC',
        targetBankAccount: 'HOME_ACCOUNT',
        tags: ['BigAmount', 'Test Tag'],
        agent: 'home-app-frontend',
        receiptId: 1,
    },
    {
        type: 'income',
        context: 'home',
        category: 'SALARY',
        origin: 'ITK Engineering GmbH',
        description: 'November',
        date: {
            datetime: '2023-11-05T01:00:00.000+01:00',
        },
        amount: 3000,
        currency: 'EUR',
        exchangeRate: 1,
        paymentMethod: 'EC',
        targetBankAccount: 'HOME_ACCOUNT',
        tags: [],
        agent: 'home-app-frontend',
    },
]

const TransactionsOverview = ({ systemInfo }: TransactionsOverviewProps) => {
    return (
        <>
            <div className="relative flex h-full min-h-screen w-full flex-col justify-between p-4">
                <div className="flex flex-grow flex-col items-center justify-between gap-10">
                    <h1 className="mt-48 text-center text-xl font-bold text-primary lg:text-2xl">
                        Posipaki Home Accounts App: Transactions
                    </h1>
                    <div className="flex w-full flex-col gap-3">
                        <h2>List of transactions</h2>
                        <ScrollArea className="h-[190px]">
                            {transactionsData.map((transaction) => {
                                return (
                                    <>
                                        <div className="flex w-full flex-col gap-1 rounded-md border border-input bg-background-overlay px-3 py-2 text-sm font-medium text-primary ring-offset-background">
                                            <div className="flex w-full justify-between">
                                                <p className="w-[200px] truncate">
                                                    {transaction.origin}
                                                </p>
                                                <p className="block w-1/3 text-right">
                                                    {`${transaction.amount} ${transaction.currency}`}
                                                </p>
                                            </div>
                                            <div className="flex w-full justify-between">
                                                <p>
                                                    {HomeAppDate.fromISO(
                                                        transaction.date
                                                            .datetime
                                                    ).toWords()}
                                                </p>
                                                {transaction.receiptId && (
                                                    <p>📄</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </ScrollArea>
                    </div>
                    <Button className="self-end" variant="secondary">
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
