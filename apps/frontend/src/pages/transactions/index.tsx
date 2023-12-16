import Link from 'next/link'

import OverlayImage from '../../components/Overlay'
import { SystemInfo, SystemInfoFooter } from '../../components/SystemInfoFooter'
import { TransactionsPreview } from '../../components/TransactionsPreview'
import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'

type TransactionsPageProps = {
    systemInfo: SystemInfo
}

const TransactionsPage = ({ systemInfo }: TransactionsPageProps) => {
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
