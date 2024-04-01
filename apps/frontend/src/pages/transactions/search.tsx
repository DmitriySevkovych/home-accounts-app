// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Transaction } from 'domain-model'
import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Calendar } from '../../components/Calendar'
import { TextInput } from '../../components/Inputs'
import { SelectMany } from '../../components/Select'
import { SectionHeading } from '../../components/Typography'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/pages/TransactionFormPage'
import { PAGES } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'

type SearchTransactionsPageProps = {
    constants: TransactionFormConstants
}

const SearchParametersFormSchema = z
    .object({
        categories: z.optional(z.string().array()),
        origin: z.optional(z.string()),
        description: z.optional(z.string()),
        dateFrom: z.optional(z.coerce.date()),
        dateUntil: z.optional(z.coerce.date()),
        tags: z.optional(z.string().array()),
        // TODO for future feature iterations
        // taxCategory: z.optional(z.optional(z.string())),
        // bankAccount: z.optional(z.optional(z.string())),
        // paymentMethod: z.optional(z.string()),
        // currency: z.optional(z.string().toUpperCase().length(3)),
        // investment: z.optional(z.string()),
        // invoiceKey: z.optional(z.string()),
    })
    .superRefine((form, ctx) => {
        const { dateFrom, dateUntil } = form
        // Dates check
        if (dateFrom && dateUntil && dateFrom > dateUntil) {
            ctx.addIssue({
                path: ['dateUntil'],
                code: z.ZodIssueCode.custom,
                message: 'Second date must be after first date',
            })
        }
    })

type SearchParameters = z.infer<typeof SearchParametersFormSchema>

const SearchTransactionsPage: React.FC<SearchTransactionsPageProps> = ({
    constants,
}) => {
    // State
    const [searchResults, setSearchResults] = useState<Transaction | null>(null)

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
    })

    const _search: SubmitHandler<SearchParameters> = async (
        parameters: SearchParameters
    ) => {
        //TODO
        console.log(parameters)
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
