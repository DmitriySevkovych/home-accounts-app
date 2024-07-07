import { Coins, LineChart, UserCog } from 'lucide-react'
import React from 'react'

import { SystemInfo, SystemInfoFooter } from '../components/SystemInfoFooter'
import { MainHeading } from '../components/Typography'
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

const ICONSIZE = 28

export default function Home({ systemInfo }: HomePageProps) {
    return (
        <div className="flex h-full flex-col items-center justify-between p-5">
            <MainHeading className="py-10">Home Accounting App</MainHeading>

            <div className="grid items-center gap-8">
                {/* Transactions */}
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="flex w-[175px] justify-start md:w-[400px] lg:w-[500px]">
                                <Coins
                                    size={ICONSIZE}
                                    className="mr-4 text-primary"
                                />
                                Transactions
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[175px] gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <NavigationListItem
                                        href={PAGES.transactions.index}
                                        title="List"
                                    >
                                        See the latest transactions.
                                    </NavigationListItem>
                                    <NavigationListItem
                                        href={PAGES.transactions.new}
                                        title="Create"
                                    >
                                        Create a new transaction.
                                    </NavigationListItem>
                                    <NavigationListItem
                                        href={PAGES.transactions.search}
                                        title="Search"
                                    >
                                        Search transactions.
                                    </NavigationListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Analysis */}
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="flex w-[175px] justify-start md:w-[400px] lg:w-[500px]">
                                <LineChart
                                    size={ICONSIZE}
                                    className="mr-4 text-primary"
                                />
                                Analysis
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[175px] gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <NavigationListItem
                                        href={PAGES.analysis.cashflow}
                                        title="Cashflow"
                                    >
                                        See current cashflow diagram.
                                    </NavigationListItem>
                                    <NavigationListItem
                                        href={PAGES.transactions.new}
                                        title="Chart"
                                    >
                                        See current chart.
                                    </NavigationListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Administration */}
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="flex w-[175px] justify-start md:w-[400px] lg:w-[500px]">
                                <UserCog
                                    size={ICONSIZE}
                                    className="mr-4 text-primary"
                                />
                                Administration
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[175px] gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
