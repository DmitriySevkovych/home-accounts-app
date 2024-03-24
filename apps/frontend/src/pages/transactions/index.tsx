import Link from 'next/link'

import OverlayImage from '../../components/Overlay'
import { TransactionsPreview } from '../../components/TransactionsPreview'
import { MainHeading } from '../../components/Typography'
import { PAGES } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'

const TransactionsPage = () => {
    return (
        <>
            <div className="relative flex h-full w-full flex-col justify-between p-4">
                <div className="flex flex-grow flex-col items-center justify-between gap-10">
                    <MainHeading>Transactions</MainHeading>

                    <div className="flex w-full flex-col gap-1">
                        <TransactionsPreview />
                    </div>

                    <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
                        <Link href={PAGES.transactions.new}>
                            <Button className="w-full" variant="primary">
                                New
                            </Button>
                        </Link>
                        <Link href={PAGES.transactions.search}>
                            <Button className="w-full" variant="secondary">
                                Search
                            </Button>
                        </Link>
                    </div>
                </div>
                <OverlayImage />
            </div>
        </>
    )
}

export default TransactionsPage
