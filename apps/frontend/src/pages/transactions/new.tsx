// Debug tool
import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'
import React from 'react'

import { Calendar } from '../../components/Calendar'
import { NumberInput, TextAreaInput, TextInput } from '../../components/Inputs'
import Radio from '../../components/Radio'
import Select from '../../components/Select'
import TagsManager from '../../components/TagsManager'
import useNewTransactionForm from '../../components/hooks/useNewTransactionForm'
import useNewTransactionSubmitHandler from '../../components/hooks/useNewTransactionSubmitHandler'
import { BACKEND_BASE_URL } from '../../helpers/constants'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'

// Type of arguments for export function (from getServerSideProps)
type NewTransactionPageProps = {
    transactionCategories: TransactionCategory[]
    taxCategories: TaxCategory[]
    paymentMethods: PaymentMethod[]
    bankAccounts: BankAccount[]
    tags: string[]
}

const NewTransactionPage = ({
    transactionCategories,
    paymentMethods,
    bankAccounts,
    taxCategories,
    tags,
}: NewTransactionPageProps) => {
    const { form } = useNewTransactionForm()
    const transactionType = form.watch('type')
    const { onSubmit } = useNewTransactionSubmitHandler()

    return (
        <div className="mx-auto max-w-4xl bg-background p-3 text-darkest md:py-8">
            <h1 className="mb-6 text-xl font-bold text-primary lg:mb-12 lg:text-2xl">
                Create Transaction
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full grid-cols-2 gap-4 space-y-6 lg:grid"
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
                        options={transactionCategories
                            .filter((cat) =>
                                cat.allowedTypes.includes(transactionType)
                            )
                            .map((obj) => obj.category)
                            .sort()}
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

                    <Calendar id="date" form={form} label="Transaction date" />

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
                        options={paymentMethods.map((obj) => obj.method).sort()}
                    />

                    {transactionType === 'expense' && (
                        <Select
                            id="sourceBankAccount"
                            form={form}
                            label="Source Bank Account"
                            options={bankAccounts
                                .map((obj) => obj.account)
                                .sort()}
                        />
                    )}

                    {transactionType === 'income' && (
                        <Select
                            id="targetBankAccount"
                            form={form}
                            label="Target Bank Account"
                            options={bankAccounts
                                .map((obj) => obj.account)
                                .sort()}
                        />
                    )}

                    <Select
                        id="taxCategory"
                        form={form}
                        label="Tax Category"
                        options={taxCategories
                            .map((obj) => obj.category)
                            .sort()}
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
                        <TagsManager
                            id="tags"
                            form={form}
                            label="Tags"
                            initialTags={tags}
                        />
                    </div>

                    <Button
                        className="flex w-full md:ml-auto md:mr-0 md:w-auto lg:col-span-2"
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
        const response = await fetch(
            `${BACKEND_BASE_URL}/utils/constants/transactions`
        )

        const constants = await response.json()

        return {
            props: {
                ...constants,
            },
        }
    } catch (err) {
        console.log(err)
    }
}

export default NewTransactionPage
