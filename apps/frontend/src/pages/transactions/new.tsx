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
import { type SubmitHandler, useForm } from 'react-hook-form'

import { DateInput } from '../../components/Calendar'
import { NumberInput, TextAreaInput, TextInput } from '../../components/Inputs'
import Radio from '../../components/Radio'
import Select from '../../components/Select'
import TagsManager from '../../components/TagsManager'
import {
    type NewTransactionForm,
    NewTransactionFormSchema,
} from '../../helpers/zod-form-schemas'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'
import { useToast } from '../../lib/shadcn/use-toast'

// For backend fetch
const backendBaseUrl = `${process.env['NEXT_PUBLIC_BACKEND_URL']}/${process.env['NEXT_PUBLIC_BACKEND_API_BASE']}`

// Type of arguments for export function (from getServerSideProps)
type NewTransactionPageProps = {
    transactionCategories: string[]
    paymentMethods: string[]
    bankAccounts: string[]
    taxCategories: string[]
}

const NewTransactionPage = ({
    transactionCategories,
    paymentMethods,
    bankAccounts,
    taxCategories,
}: NewTransactionPageProps) => {
    const formDefaultValues: Partial<NewTransactionForm> = {
        type: 'expense',
        context: 'home',
        category: 'HOUSEHOLD',
        date: new Date(),
        currency: 'EUR',
        exchangeRate: 1,
        paymentMethod: 'EC',
        tags: [],
    }

    const form = useForm<NewTransactionForm>({
        resolver: zodResolver(NewTransactionFormSchema),
        defaultValues: formDefaultValues,
    })

    const transactionType = form.watch('type')

    const { toast } = useToast()

    const withSign = (amount: number): number => {
        if (transactionType === 'expense' && amount > 0) {
            return -1 * amount
        }
        if (transactionType === 'income' && amount < 0) {
            return -1 * amount
        }
        return amount
    }

    const onSubmit: SubmitHandler<NewTransactionForm> = async (data) => {
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
            .withAmount(withSign(amount))
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
            const response = await fetch(`${backendBaseUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            })
            if (response.status === 201) {
                toast({
                    title: 'A new transaction has been created! You submitted the following values:',
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">
                                {JSON.stringify(data, null, 2)}
                            </code>
                        </pre>
                    ),
                })
                form.reset(formDefaultValues)
                // router.push('/')
            } else {
                toast({
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
                            label="Transaction type"
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
                            label="Transaction context"
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
                        placeholder={`Where did the ${transactionType} occur?`}
                    />

                    <TextInput
                        id="description"
                        form={form}
                        label="Description"
                        placeholder={`What characterizes the ${transactionType}?`}
                    />

                    <DateInput id="date" form={form} label="Transaction date" />

                    <NumberInput
                        id="amount"
                        form={form}
                        label="Amount"
                        placeholder={`Please enter ${transactionType} amount`}
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

                    {transactionType === 'expense' && (
                        <Select
                            id="sourceBankAccount"
                            form={form}
                            label="Source Bank Account"
                            options={bankAccounts}
                            isRequired
                        />
                    )}

                    {transactionType === 'income' && (
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
                            placeholder="Comment on why the money is moving, e.g. 'Verwendungszweck'"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <TagsManager id="tags" form={form} label="Tags" />
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
            `${backendBaseUrl}/utils/transactionCategories`
        )
        const paymentMethodsPromise = fetch(
            `${backendBaseUrl}/utils/paymentMethods`
        )
        const bankAccountsPromise = fetch(
            `${backendBaseUrl}/utils/bankAccounts`
        )
        const taxCategoriesPromise = fetch(
            `${backendBaseUrl}/utils/taxCategories`
        )

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

export default NewTransactionPage
