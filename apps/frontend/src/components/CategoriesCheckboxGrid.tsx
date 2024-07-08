import { TransactionCategory } from 'domain-model'
import React from 'react'
import useSWR from 'swr'

import { safeFetch } from '../helpers/requests'
import { API } from '../helpers/routes'
import { Checkbox } from '../lib/shadcn/Checkbox'
import { ScrollArea } from '../lib/shadcn/ScrollArea'
import { Loader, SectionHeading } from './Typography'

type CategoriesCheckboxGridProps = {
    checkedCategories: string[]
    setCheckedCategories: React.Dispatch<React.SetStateAction<string[]>>
}

const _fetchAllTransactionCategories = async (
    url: string
): Promise<TransactionCategory[]> => {
    const res = await safeFetch(url)
    return await res.json()
}
const CategoriesCheckboxGrid: React.FC<CategoriesCheckboxGridProps> = ({
    checkedCategories,
    setCheckedCategories,
}) => {
    // Queried data
    const { data, error, isLoading } = useSWR(
        API.client.transactions.constants.getCategories,
        _fetchAllTransactionCategories
    )

    if (isLoading) return <Loader />

    const categories = new Set(data?.map((c) => c.category))

    return (
        <ScrollArea className="flex flex-col justify-center">
            <SectionHeading>Select transaction categories</SectionHeading>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {[...categories].map((category) => {
                    return (
                        <div
                            key={`categories-checkbox-${category}`}
                            className="flex gap-1"
                        >
                            <Checkbox
                                id={category}
                                onCheckedChange={(isChecked) => {
                                    if (isChecked) {
                                        setCheckedCategories([
                                            ...checkedCategories,
                                            category,
                                        ])
                                    } else {
                                        setCheckedCategories(
                                            checkedCategories.filter(
                                                (c) => c !== category
                                            )
                                        )
                                    }
                                }}
                            />
                            <label
                                htmlFor={category}
                                className="text-sm capitalize"
                            >
                                {category.toLowerCase().replace('_', ' ')}
                            </label>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}

export default CategoriesCheckboxGrid
