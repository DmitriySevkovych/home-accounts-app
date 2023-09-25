import Link from 'next/link'
import React from 'react'

import { SystemInfo, SystemInfoFooter } from '../../components/SystemInfoFooter'
import { PAGES } from '../../helpers/pages'
import { Button } from '../../lib/shadcn/Button'

type TransactionsOverviewProps = {
    systemInfo: SystemInfo
}

const TransactionsOverview = ({ systemInfo }: TransactionsOverviewProps) => {
    return (
        <>
            <div className="min-h-screen w-full h-full flex flex-col justify-between p-4">
                <div className="flex flex-col flex-grow justify-center gap-10 items-center">
                    <h1 className="font-bold text-xl lg:text-2xl text-primary">
                        Posipaki Home Accounts App: Transactions
                    </h1>
                    <Button>
                        <Link href={PAGES.transactions.new}>
                            Create New Transaction
                        </Link>
                    </Button>
                </div>
                <SystemInfoFooter {...systemInfo} />
            </div>
        </>
    )
}

export const getServerSideProps = async () => {
    let backendInfo
    try {
        const req = await fetch(
            `${process.env['NEXT_PUBLIC_BACKEND_URL']}/system/info`
        )
        backendInfo = await req.json()
    } catch (err) {
        backendInfo = {
            error: `Fetch ${process.env['NEXT_PUBLIC_BACKEND_URL']} failed`,
        }
        console.error(err)
    }
    return {
        props: {
            systemInfo: {
                frontend: {
                    environment: process.env['APP_ENV'],
                },
                backend: backendInfo,
            },
        },
    }
}

export default TransactionsOverview
