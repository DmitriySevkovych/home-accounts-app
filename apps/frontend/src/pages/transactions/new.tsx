// Debug tool
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
    TransactionDate,
    createTransaction,
} from 'domain-model'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { DateInput } from '../../components/Calendar'
import {
    AmountInput,
    NumberInput,
    TextAreaInput,
    TextInput,
} from '../../components/Inputs'
import Radio from '../../components/Radio'
import Select from '../../components/Select'
import Tags from '../../components/Tags'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'
import { Toast } from '../../lib/shadcn/Toast'

// For backend fetch
const baseUrl = `${process.env['NEXT_PUBLIC_BACKEND_URL']}/${process.env['NEXT_PUBLIC_BACKEND_API_BASE']}`

// Type of arguments for export function (from getServerSideProps)
type NewTransactionPageProps = {
    transactionCategories: string[]
    paymentMethods: string[]
    bankAccounts: string[]
    taxCategories: string[]
}

// TODO add validation texts
const TransactionFormSchema = z.object({
    type: z.enum(['expense', 'income']),
    category: z.string(),
    origin: z.string(),
    description: z.string(),
    date: z.date(),
    // date: z.string().datetime(),
    amount: z.coerce.number(),
    currency: z.string().length(3),
    exchangeRate: z.coerce.number(),
    paymentMethod: z.string(),
    sourceBankAccount: z.optional(z.string()),
    targetBankAccount: z.optional(z.string()),
    taxCategory: z.optional(z.string()),
    comment: z.optional(z.string()),
    context: z.enum(['home', 'work', 'investments']),
    tags: z.string().array(),
})

export default function NewTransaction({
    transactionCategories,
    paymentMethods,
    bankAccounts,
    taxCategories,
}: NewTransactionPageProps) {
    const form = useForm<z.infer<typeof TransactionFormSchema>>({
        resolver: zodResolver(TransactionFormSchema),
        defaultValues: {
            type: 'expense',
            category: 'HOUSEHOLD',
            date: new Date(),
            currency: 'EUR',
            exchangeRate: 1,
            paymentMethod: 'EC',
            context: 'home',
            tags: [],
        },
    })

    const onSubmit = async (data: z.infer<typeof TransactionFormSchema>) => {
        const {
            type,
            category,
            origin,
            description,
            amount,
            tags,
            date,
            comment,
            currency,
            exchangeRate,
            context,
            paymentMethod,
            sourceBankAccount,
            targetBankAccount,
            taxCategory,
        } = data
        const builder = createTransaction()
            .about(category, origin, description)
            .withType(type)
            .withAmount(amount)
            .withCurrency(currency, exchangeRate)
            .withDate(TransactionDate.fromISO(date.toISOString())) // TODO cleanup
            .withContext(context)
            .withAgent('test-agent') // TODO agent should be the logged in user, once there is a login
            .addTags(tags)

        if (comment) builder.withComment(comment)
        if (taxCategory) builder.withTaxCategory(taxCategory)
        if (type === 'expense' && sourceBankAccount) {
            builder.withPaymentFrom(paymentMethod, sourceBankAccount)
        } else if (type === 'income' && targetBankAccount) {
            builder.withPaymentTo(paymentMethod, targetBankAccount)
        }

        const transaction = builder.validate().build()

        try {
            const response = await fetch(`${baseUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            })
            if (response.status === 201) {
                // TODO shadcn seems to have updated the Toast (and Toaster) component, cf. https://ui.shadcn.com/docs/components/toast
                Toast({
                    title: 'A new transaction has been created! You submitted the following values:',
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">
                                {JSON.stringify(data, null, 2)}
                            </code>
                        </pre>
                    ),
                })
                // router.push('/')
            } else {
                // TODO shadcn seems to have updated the Toast (and Toaster) component, cf. https://ui.shadcn.com/docs/components/toast
                Toast({
                    title: `Something when wrong! Received ${response.status} ${response.statusText}`,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-3 md:py-8 bg-background text-darkest max-w-4xl mx-auto">
            <h1 className="font-bold text-xl lg:text-2xl mb-6 lg:mb-12 text-primary">
                Create Transaction
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 lg:grid grid-cols-2 gap-4"
                >
                    <div className="lg:col-span-2">
                        <Radio
                            id="type"
                            form={form}
                            options={[
                                { label: 'Expense', value: 'expense' },
                                { label: 'Income', value: 'income' },
                            ]}
                        />
                    </div>

                    <Select
                        id="category"
                        form={form}
                        label="Category"
                        options={transactionCategories}
                        isRequired
                    />

                    <TextInput
                        id="origin"
                        form={form}
                        label="Origin"
                        placeholder="Origin"
                    />

                    <TextInput
                        id="description"
                        form={form}
                        label="Description"
                        placeholder="Description"
                    />

                    <DateInput id="date" form={form} label="Transaction date" />

                    <AmountInput
                        id="amount"
                        form={form}
                        label="Amount"
                        transactionType={form.watch('type')}
                        placeholder={`Please enter ${form.watch(
                            'type'
                        )} amount`}
                    />

                    <TextInput id="currency" form={form} label="Currency" />

                    <NumberInput
                        id="exchangeRate"
                        form={form}
                        label="Exchange Rate"
                    />

                    <Select
                        id="paymentMethod"
                        form={form}
                        label="Payment Method"
                        options={paymentMethods}
                        isRequired
                    />

                    {form.watch('type') === 'expense' && (
                        <Select
                            id="sourceBankAccount"
                            form={form}
                            label="Source Bank Account"
                            options={bankAccounts}
                            isRequired
                        />
                    )}

                    {form.watch('type') === 'income' && (
                        <Select
                            id="targetBankAccount"
                            form={form}
                            label="Target Bank Account"
                            options={bankAccounts}
                            isRequired
                        />
                    )}

                    <Select
                        id="taxCategory"
                        form={form}
                        label="Tax Category"
                        options={taxCategories}
                    />

                    <div className="lg:col-span-2">
                        <TextAreaInput
                            id="comment"
                            form={form}
                            label="Comment"
                            placeholder="Comment"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <Radio
                            id="context"
                            form={form}
                            options={[
                                { label: 'Home', value: 'home' },
                                { label: 'Work', value: 'work' },
                                {
                                    label: 'Investments',
                                    value: 'investments',
                                },
                            ]}
                            label="Select transaction context"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <Tags id="tags" form={form} label="Tags" />
                    </div>

                    <Button
                        className="flex w-full md:w-auto md:mr-0 md:ml-auto lg:col-span-2"
                        type="submit"
                        size={'lg'}
                    >
                        Submit
                    </Button>
                </form>
            </Form>
            {/* <DevTool control={form.control} /> */}
        </div>
    )
}

export async function getServerSideProps() {
    try {
        // TODO check this for a refactoring: https://dev.to/davidbell_xyz/using-promise-all-with-async-await-to-get-data-from-multiple-endpoints-5baj
        const transactionCategoriesPromise = fetch(
            `${baseUrl}/utils/transactionCategories`
        )
        const paymentMethodsPromise = fetch(`${baseUrl}/utils/paymentMethods`)
        const bankAccountsPromise = fetch(`${baseUrl}/utils/bankAccounts`)
        const taxCategoriesPromise = fetch(`${baseUrl}/utils/taxCategories`)

        const responses = await Promise.all([
            transactionCategoriesPromise,
            paymentMethodsPromise,
            bankAccountsPromise,
            taxCategoriesPromise,
        ])

        const data = await Promise.all(
            responses.map((response) => response.json())
        )

        const transactionCategories: string[] = data[0].map(
            (obj: TransactionCategory) => obj.category
        )
        const paymentMethods: string[] = data[1].map(
            (obj: PaymentMethod) => obj.method
        )
        const bankAccounts: string[] = data[2].map(
            (obj: BankAccount) => obj.account
        )
        const taxCategories: string[] = data[3].map(
            (obj: TaxCategory) => obj.category
        )

        return {
            props: {
                transactionCategories,
                paymentMethods,
                bankAccounts,
                taxCategories,
            },
        }
    } catch (err) {
        console.log(err)
    }
}
