import { DevTool } from '@hookform/devtools'
import {
    BankAccount,
    Investment,
    PaymentMethod,
    ProjectInvoice,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'
import React from 'react'

import { Calendar } from '../../components/Calendar'
import { DropzoneFormField } from '../../components/Dropzone'
import { NumberInput, TextAreaInput, TextInput } from '../../components/Inputs'
import InlineSvgImage from '../../components/Overlay'
import OverlayImage from '../../components/Overlay'
import Radio from '../../components/Radio'
import Select from '../../components/Select'
import TagsManager from '../../components/TagsManager'
import useNewTransactionForm from '../../components/hooks/useNewTransactionForm'
import useNewTransactionSubmitHandler from '../../components/hooks/useNewTransactionSubmitHandler'
import { SERVER_BACKEND_BASE_URL } from '../../helpers/constants'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'
import { Separator } from '../../lib/shadcn/Separator'

// Type of arguments for export function (from getServerSideProps)
type NewTransactionPageProps = {
    transactionCategories: TransactionCategory[]
    taxCategories: TaxCategory[]
    paymentMethods: PaymentMethod[]
    bankAccounts: BankAccount[]
    tags: string[]
    investments: Investment[]
    invoices: ProjectInvoice[]
}

const NewTransactionPage = ({
    transactionCategories,
    paymentMethods,
    bankAccounts,
    taxCategories,
    tags,
    investments,
    invoices,
}: NewTransactionPageProps) => {
    const { form } = useNewTransactionForm()
    const transactionType = form.watch('type')
    const transactionContext = form.watch('context')
    const { onSubmit } = useNewTransactionSubmitHandler()

    return (
        <div className="relative mx-auto max-w-4xl bg-background p-3 text-darkest md:py-8">
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

                    {transactionContext === 'investments' && (
                        <div>
                            <Select
                                id="investment"
                                form={form}
                                label="Investment"
                                options={investments
                                    .map((obj) => obj.key)
                                    .sort()}
                            />
                        </div>
                    )}

                    {transactionContext === 'work' &&
                        transactionType === 'expense' && (
                            <>
                                <div>
                                    <NumberInput
                                        id="vat"
                                        form={form}
                                        label="VAT (Value-Added Tax)"
                                        placeholder="Enter a number between 0 and 100, e.g. 19"
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        id="country"
                                        form={form}
                                        label="Taxation country"
                                        placeholder="Enter a country code, e.g. 'DE'"
                                    />
                                </div>
                            </>
                        )}

                    {transactionContext === 'work' &&
                        transactionType === 'income' && (
                            <div>
                                <Select
                                    id="invoiceKey"
                                    form={form}
                                    label="Project invoice for this transaction"
                                    options={invoices
                                        // .sort((obj1, obj2) => obj1.issuanceDate.valueOf() - obj2.issuanceDate.valueOf())
                                        // .reverse()
                                        .map((obj) => obj.key)}
                                />
                            </div>
                        )}

                    <div className="lg:col-span-2">
                        <>
                            <Separator />
                            <TagsManager
                                id="tags"
                                form={form}
                                label="Tags"
                                initialTags={tags}
                            />
                        </>
                    </div>

                    <div className="lg:col-span-2">
                        <DropzoneFormField
                            id="receipt"
                            form={form}
                            label="Transaction receipt"
                        />
                    </div>

                    <Button
                        className="flex w-full md:ml-auto md:mr-0 md:w-auto lg:col-span-2"
                        variant="destructive"
                        type="submit"
                        size={'lg'}
                    >
                        Submit
                    </Button>
                </form>
            </Form>
            <OverlayImage />
            {/* <DevTool control={form.control} /> */}
        </div>
    )
}

export async function getServerSideProps() {
    try {
        const urls = [
            `${SERVER_BACKEND_BASE_URL}/utils/constants/transactions`,
            `${SERVER_BACKEND_BASE_URL}/investments`,
            `${SERVER_BACKEND_BASE_URL}/work/invoices`,
        ]

        const response = await Promise.all(
            urls.map((url) => fetch(url).then((res) => res.json()))
        )

        return {
            props: {
                ...response[0],
                ...response[1],
                ...response[2],
            },
        }
    } catch (err) {
        console.log(err)
    }
}

export default NewTransactionPage
