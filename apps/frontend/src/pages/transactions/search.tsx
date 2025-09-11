// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    SearchParameters,
    SearchParametersFormSchema,
    Transaction,
    deserializeTransaction,
} from 'domain-model'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'

import { Calendar } from '../../components/Calendar'
import { TextInput } from '../../components/Inputs'
import Radio from '../../components/Radio'
import { SelectMany } from '../../components/Select'
import { TransactionPreviewCard } from '../../components/TransactionPreviewCard'
import { Loader, SectionHeading } from '../../components/Typography'
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

const SearchTransactionsPage: React.FC = () => {
    // State
    const [searchResults, setSearchResults] = useState<
        Transaction[] | undefined
    >(undefined)
    const [moreResultsAvailable, setMoreResultsAvailable] = useState<
        boolean | undefined
    >(undefined)
    const [nextResultPage, setNextResultPage] = useState<number>(1)

    // Input data
    const {
        data: constants,
        // error,
        isLoading,
    } = useSWR<TransactionFormConstants>(
        'fetchTransactionConstants',
        fetchTransactionConstants
    )

    // Form setup
    const form = useForm<SearchParameters>({
        resolver: zodResolver(SearchParametersFormSchema),
        defaultValues: {
            searchCombination: 'and',
        },
    })

    if (isLoading) return <Loader />

    const { tags } = constants!
    const { transactionCategories } = constants!
    const categories = [
        ...new Set(transactionCategories.map((c) => c.category)),
    ]
    categories.sort()

    const _search = async (
        parameters: SearchParameters,
        page: number = 1
    ): Promise<void> => {
        const response = await safeFetch(
            API.client.transactions.search({ page }),
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ parameters }),
            }
        )

        const responseData: {
            transactions: Transaction[]
            endReached: boolean
        } = await response.json()
        const { transactions, endReached } = responseData

        setMoreResultsAvailable(!endReached)
        setNextResultPage(page + 1)
        const newResults = transactions.map((t) => deserializeTransaction(t))
        if (page === 1) {
            setSearchResults(newResults)
        } else {
            setSearchResults((previousResults) =>
                previousResults
                    ? [...previousResults, ...newResults]
                    : newResults
            )
        }
    }

    const _firstSearch: SubmitHandler<SearchParameters> = async (
        parameters: SearchParameters
    ) => _search(parameters)

    const _loadMoreResults: SubmitHandler<SearchParameters> = async (
        parameters: SearchParameters
    ) => _search(parameters, nextResultPage)

    // Render
    return (
        <PageWithBackButton
            heading="Search transactions"
            goBackLink={PAGES.transactions.index}
        >
            <section className="mb-12">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(_firstSearch)}
                        className="w-full space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0"
                    >
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

                        <Radio<SearchParameters>
                            id="searchCombination"
                            form={form}
                            options={[
                                { label: 'And', value: 'and' },
                                { label: 'Or', value: 'or' },
                            ]}
                            label="Search combination"
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

                {searchResults?.length === 0 && (
                    <p>Nothing found. Try adjusting the search parameters...</p>
                )}

                {searchResults?.map((transaction) => (
                    <TransactionPreviewCard
                        key={transaction.id}
                        transaction={transaction}
                    />
                ))}

                {moreResultsAvailable && (
                    <div className="flex justify-center p-3">
                        <Button onClick={form.handleSubmit(_loadMoreResults)}>
                            Load more
                        </Button>
                    </div>
                )}
            </section>
        </PageWithBackButton>
    )
}

export default SearchTransactionsPage
