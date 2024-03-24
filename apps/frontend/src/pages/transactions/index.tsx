import Link from 'next/link'

import OverlayImage from '../../components/Overlay'
import { TransactionsPreview } from '../../components/TransactionsPreview'
import { PAGES } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'

const TransactionsPage = () => {
    return (
        <>
            <div className="relative flex h-full w-full flex-col justify-between p-4">
                <div className="flex flex-grow flex-col items-center justify-between gap-10">
                    <h1 className="mt-24 text-center text-xl font-bold text-primary lg:text-2xl">
                        Transactions
                    </h1>
                    <div className="flex w-full flex-col gap-1">
                        <TransactionsPreview />
                    </div>

                    <Link className="w-full" href={PAGES.transactions.new}>
                        <Button className="w-full" variant="primary">
                            New
                        </Button>
                    </Link>
                </div>
                <OverlayImage />
            </div>
        </>
    )
}

export default TransactionsPage
