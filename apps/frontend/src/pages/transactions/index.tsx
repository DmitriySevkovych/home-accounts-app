import Link from 'next/link'
import React from 'react'

import { PAGES } from '../../helpers/pages'
import { Button } from '../../lib/shadcn/Button'

type TransactionsOverviewProps = {
    environment: string
}

const TransactionsOverview = ({ environment }: TransactionsOverviewProps) => {
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
                <p className="place-self-end">
                    Running in {environment} environment
                </p>
            </div>
        </>
    )
}

export const getServerSideProps = () => {
    return {
        props: {
            environment: process.env.NODE_ENV,
        },
    }
}

export default TransactionsOverview
