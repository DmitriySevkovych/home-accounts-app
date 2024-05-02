// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    SearchParameters,
    SearchParametersFormSchema,
    Transaction,
    deserializeTransaction,
} from 'domain-model'
import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Calendar } from '../../components/Calendar'
import { TextInput } from '../../components/Inputs'
import Radio from '../../components/Radio'
import { SelectMany } from '../../components/Select'
import { TransactionPreviewCard } from '../../components/TransactionPreviewCard'
import { SectionHeading } from '../../components/Typography'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/pages/TransactionFormPage'
import { safeFetch } from '../../helpers/requests'
import { PAGES } from '../../helpers/routes'
import { API } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'

type SearchTransactionsPageProps = {
    constants: TransactionFormConstants
}

const SearchTransactionsPage: React.FC<SearchTransactionsPageProps> = ({
    constants,
}) => {
    // State
    const [searchResults, setSearchResults] = useState<
        Transaction[] | null | undefined
    >(undefined)
    const [moreResultsAvailable, setMoreResultsAvailable] = useState<
        boolean | undefined
    >(undefined)
    const [nextResultPage, setNextResultPage] = useState<number>(1)

    const { tags } = constants
    // Input data
    const categories = useMemo(() => {
        const { transactionCategories } = constants
        const distinctCategories = [
            ...new Set(transactionCategories.map((c) => c.category)),
        ]
        return distinctCategories.sort()
    }, [constants])

    // Form setup
    const form = useForm<SearchParameters>({
        resolver: zodResolver(SearchParametersFormSchema),
        defaultValues: {
            searchCombination: 'and',
        },
    })

    const _search: SubmitHandler<SearchParameters> = async (
        parameters: SearchParameters
    ) => {
        const url = API.client.transactions.search({
            page: nextResultPage,
        })
        const response = await safeFetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ parameters }),
        })

        const responseData: {
            transactions: Transaction[]
            endReached: boolean
        } = await response.json()
        const { transactions, endReached } = responseData
        setMoreResultsAvailable(!endReached)
        setNextResultPage((previousPage) => previousPage + 1)
        if (transactions.length > 0) {
            setSearchResults(transactions.map((t) => deserializeTransaction(t)))
        } else {
            setSearchResults(null)
        }
    }

    // Render
    return (
        <PageWithBackButton
            heading="Search transactions"
            goBackLink={PAGES.transactions.index}
        >
            <section className="mb-12">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(_search)}
                        className="w-full grid-cols-2 gap-4 space-y-6 lg:grid"
                    >
                        <Radio<SearchParameters>
                            id="searchCombination"
                            form={form}
                            options={[
                                { label: 'And', value: 'and' },
                                { label: 'Or', value: 'or' },
                            ]}
                            label="Search combination"
                        />

                        <Calendar<SearchParameters>
                            id="dateFrom"
                            form={form}
                            label="Date from"
                        />

                        <Calendar<SearchParameters>
                            id="dateUntil"
                            form={form}
                            label="Date until"
                        />

                        <SelectMany<SearchParameters>
                            id="categories"
                            form={form}
                            label="Categories"
                            options={categories}
                        />

                        <SelectMany<SearchParameters>
                            id="tags"
                            form={form}
                            label="Tags"
                            options={tags}
                        />

                        <TextInput
                            id="origin"
                            form={form}
                            label="Origin"
                            placeholder="Origin fuzzy search"
                        />

                        <TextInput
                            id="description"
                            form={form}
                            label="Description"
                            placeholder="Description fuzzy search"
                        />

                        <Button
                            className="flex w-full md:ml-auto md:mr-0 md:w-auto lg:col-span-2"
                            variant="primary"
                            type="submit"
                            size={'lg'}
                        >
                            Search
                        </Button>
                    </form>
                </Form>
                {/* <DevTool control={form.control} /> */}
            </section>

            <section>
                <SectionHeading>Results</SectionHeading>

                {searchResults === null && (
                    <p>Nothing found. Try adjusting the search parameters...</p>
                )}

                {searchResults?.map((transaction) => (
                    <TransactionPreviewCard
                        key={transaction.id}
                        transaction={transaction}
                    />
                ))}

                {moreResultsAvailable && <Button>Load more</Button>}
            </section>
        </PageWithBackButton>
    )
}

export const getServerSideProps = async () => {
    try {
        return {
            props: {
                constants: await fetchTransactionConstants(),
            },
        }
    } catch (err) {
        console.log(err)
    }
}

export default SearchTransactionsPage
