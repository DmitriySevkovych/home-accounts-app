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

type TransactionsOverviewProps = {
    systemInfo: SystemInfo
}

const TransactionsOverview = ({ systemInfo }: TransactionsOverviewProps) => {
    return (
        <>
            <div className="relative flex h-full min-h-screen w-full flex-col justify-between p-4">
                <div className="flex flex-grow flex-col items-center justify-center gap-10">
                    <h1 className="text-center text-xl font-bold text-primary lg:text-2xl">
                        Posipaki Home Accounts App: Transactions
                    </h1>
                    <Button>
                        <Link href={PAGES.transactions.new}>
                            Create New Transaction
                        </Link>
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
