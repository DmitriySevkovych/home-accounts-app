import React from 'react'

import { SystemInfo, SystemInfoFooter } from '../components/SystemInfoFooter'
import { safeFetch } from '../helpers/requests'
import { API, PAGES } from '../helpers/routes'
import {
    NavigationListItem,
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '../lib/shadcn/NavigationMenu'

type HomePageProps = {
    systemInfo: SystemInfo
}

export default function Home({ systemInfo }: HomePageProps) {
    return (
        <div className="flex h-full flex-col items-center p-5">
            <h1 className="py-10 text-xl">Home Accounting App</h1>

            {/* A flex-growing wrapper for the navigation menu */}
            <div className="flex-grow">
                <NavigationMenu className="relative top-1/3">
                    <NavigationMenuList>
                        {/* Transactions */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Transactions
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <NavigationListItem
                                        href={PAGES.transactions.index}
                                        title="Overview"
                                    >
                                        See latest home, work and investments
                                        transactions.
                                    </NavigationListItem>
                                    <NavigationListItem
                                        href={PAGES.transactions.new}
                                        title="New Transaction"
                                    >
                                        Create a new transaction.
                                    </NavigationListItem>
                                    <NavigationListItem
                                        href={PAGES.transactions.search}
                                        title="TODO Search Transaction"
                                    >
                                        Search based on different criteria.
                                    </NavigationListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Analysis */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Analysis
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <NavigationListItem
                                        href={PAGES.analysis.cashflow}
                                        title="TODO Cashflow"
                                    >
                                        See current cashflow diagram.
                                    </NavigationListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Analysis */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Administration
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <NavigationListItem
                                        href={PAGES.admin.blueprints}
                                        title="TODO Blueprints"
                                    >
                                        Configure transaction blueprints.
                                    </NavigationListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <SystemInfoFooter {...systemInfo} />
        </div>
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
                    environment: process.env.APP_ENV,
                    branch: process.env.GIT_BRANCH
                        ? process.env.GIT_BRANCH
                        : '',
                    commit: process.env.GIT_COMMIT
                        ? process.env.GIT_COMMIT
                        : '',
                },
                backend: backendInfo,
            },
        },
    }
}
