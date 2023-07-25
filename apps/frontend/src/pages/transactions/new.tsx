import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'
import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    Transaction,
    TransactionCategory,
    TransactionDate,
    dummyTransaction,
} from 'domain-model'
import { Toast } from '../../lib/shadcn/Toast'

// Debug tool
import { DevTool } from '@hookform/devtools'
import Radio from '../../components/Radio'
import Select from '../../components/Select'
import { NumberInput, TextAreaInput, TextInput } from '../../components/Inputs'
import { DateInput } from '../../components/Calendar'

// For backend fetch
const baseUrl = `${process.env['NEXT_PUBLIC_BACKEND_URL']}/${process.env['NEXT_PUBLIC_BACKEND_API_BASE']}`

// Type of arguments for export function (from getServerSideProps)
type NewTransactionPageProps = {
    transactionCategories: string[]
    paymentMethods: string[]
    bankAccounts: string[]
    taxCategories: string[]
}

const FormSchema = z.instanceof(Transaction)

// FormSchema.refine()

export default function NewTransaction({
    transactionCategories,
    paymentMethods,
    bankAccounts,
    taxCategories,
}: NewTransactionPageProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        Toast({
            title: 'You submitted the following values:',
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        })
    }

    console.log('form.formState', form.formState)

    const typeValue = form.watch('type') ? form.watch('type') : 'expense'

    return (
        <div className="p-3">
            <h1 className="font-bold text-xl mb-6">Create Transaction</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                >
                    <Radio
                        id="type"
                        form={form}
                        defaultValue="expense"
                        options={[
                            { label: 'Expense', value: 'expense' },
                            { label: 'Income', value: 'income' },
                        ]}
                    />

                    <Select
                        id="category"
                        form={form}
                        label="Category"
                        options={transactionCategories}
                        isRequired
                        defaultValue={transactionCategories[2]}
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

                    <DateInput id="date" form={form} label="Pick a date" />

                    <NumberInput
                        id="amount"
                        form={form}
                        label="Amount"
                        placeholder="Manual minus value!"
                    />

                    <TextInput
                        id="currency"
                        form={form}
                        label="Currency"
                        defaultValue="EUR"
                    />

                    <NumberInput
                        id="exchangeRate"
                        form={form}
                        label="Exchange Rate"
                        defaultValue={1}
                    />

                    <Select
                        id="paymentMethod"
                        form={form}
                        label="Payment Method"
                        options={paymentMethods}
                        isRequired
                        defaultValue={paymentMethods[1]}
                    />

                    {typeValue === 'expense' && (
                        <Select
                            id="sourceBankAccount"
                            form={form}
                            label="Source Bank Account"
                            options={bankAccounts}
                            isRequired
                            defaultValue={bankAccounts[0]}
                        />
                    )}

                    {typeValue === 'income' && (
                        <Select
                            id="targetBankAccount"
                            form={form}
                            label="Target Bank Account"
                            options={bankAccounts}
                            isRequired
                            defaultValue={bankAccounts[0]}
                        />
                    )}

                    <Select
                        id="taxCategory"
                        form={form}
                        label="Tax Category"
                        options={taxCategories}
                    />

                    <TextAreaInput
                        id="comment"
                        form={form}
                        label="Comment"
                        placeholder="Comment"
                    />

                    <Radio
                        id="context"
                        form={form}
                        defaultValue="home"
                        options={[
                            { label: 'None', value: 'home' },
                            { label: 'Work', value: 'work' },
                            {
                                label: 'Investment',
                                value: 'investment',
                            },
                        ]}
                        label="Select transaction context"
                    />

                    {/* TODO Tags */}

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <DevTool control={form.control} />
        </div>
    )
}

export async function getServerSideProps() {
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

    const data = await Promise.all(responses.map((response) => response.json()))

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
}
