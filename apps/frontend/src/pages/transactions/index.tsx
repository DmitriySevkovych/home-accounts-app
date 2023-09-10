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
            <div>Posipaki Home Accounts App: Transactions</div>
            <Button>
                <Link href={PAGES.transactions.new}>
                    Create New Transaction
                </Link>
            </Button>

            <footer>Running in {environment} environment</footer>
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
