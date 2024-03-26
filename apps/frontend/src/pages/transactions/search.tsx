// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Transaction } from 'domain-model'
import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { SelectMany } from '../../components/Select'
import {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/TransactionFormPage'
import { MainHeading, SectionHeading } from '../../components/Typography'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'

type SearchTransactionsPageProps = {
    constants: TransactionFormConstants
}

const SearchParametersFormSchema = z.object({
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

type SearchParameters = z.infer<typeof SearchParametersFormSchema>

const SearchTransactionsPage: React.FC<SearchTransactionsPageProps> = ({
    constants,
}) => {
    // State
    const [searchResults, setSearchResults] = useState<Transaction | null>(null)

    // Input data
    const categories = useMemo(() => {
        const { transactionCategories } = constants
        const distinctCategories = [
            ...new Set(transactionCategories.map((c) => c.category)),
        ]
        return distinctCategories.toSorted()
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
        <main className="flex h-full w-full flex-col p-5">
            <MainHeading>Search transactions</MainHeading>

            <section>
                <SectionHeading>Search parameters</SectionHeading>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(_search)}>
                        <SelectMany<SearchParameters>
                            id="categories"
                            form={form}
                            label="Category"
                            options={categories}
                        />

                        <Button variant="primary" type="submit" size={'lg'}>
                            Search
                        </Button>
                    </form>
                </Form>
                {/* <DevTool control={form.control} /> */}
            </section>

            <section>
                <SectionHeading>Search results</SectionHeading>
            </section>
        </main>
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
