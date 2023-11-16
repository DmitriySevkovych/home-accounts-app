import {
    BankAccount,
    DateCheck,
    Investment,
    PaymentMethod,
    ProjectInvoice,
    TaxCategory,
    TransactionCategory,
} from 'domain-model'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'

import { API, PAGES } from '../helpers/routes'
import { Button } from '../lib/shadcn/Button'
import { Form } from '../lib/shadcn/Form'
import { Separator } from '../lib/shadcn/Separator'
import AutocompleteInput from './AutocompleteInput'
import { Calendar } from './Calendar'
import { DropzoneFormField } from './Dropzone'
import { NumberInput, TextAreaInput, TextInput } from './Inputs'
import OverlayImage from './Overlay'
import Radio from './Radio'
import Select from './Select'
import TagsManager from './TagsManager'

export type TransactionFormConstants = {
    transactionOrigins: string[]
    transactionCategories: TransactionCategory[]
    taxCategories: TaxCategory[]
    paymentMethods: PaymentMethod[]
    bankAccounts: BankAccount[]
    tags: string[]
    investments: Investment[]
    invoices: ProjectInvoice[]
}

type TransactionFormPageProps = {
    heading: string
    form: UseFormReturn<any>
    onSubmit: SubmitHandler<any>
    constants: TransactionFormConstants
}

export const fetchTransactionConstants = async () => {
    const urls = API.server.transactions.constants

    const response = await Promise.all(
        urls.map((url) => fetch(url).then((res) => res.json()))
    )

    return {
        ...response[0],
        ...response[1],
        ...response[2],
        ...response[3],
    }
}

const TransactionFormPage: React.FC<TransactionFormPageProps> = ({
    heading,
    form,
    constants,
    onSubmit,
}) => {
    const {
        transactionOrigins,
        transactionCategories,
        paymentMethods,
        bankAccounts,
        taxCategories,
        tags,
        investments,
        invoices,
    } = constants
    const transactionType = form.watch('type')
    const transactionContext = form.watch('context')

    return (
        <div className="relative mx-auto  max-w-4xl bg-background px-3 pb-3 text-darkest md:py-8">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-inherit py-3">
                <h1 className="flex-grow text-xl font-bold leading-none text-primary lg:text-2xl">
                    {heading}
                </h1>
                <Link href={PAGES.transactions.index}>
                    <Button
                        className="min-w-[40px] p-0"
                        variant="secondary"
                        type="button"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
            </div>
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

                    <AutocompleteInput
                        id="origin"
                        form={form}
                        label="Origin"
                        placeholder={`Where did the ${transactionType} occur?`}
                        autocompleteOptions={transactionOrigins}
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
                                .filter(
                                    (obj) =>
                                        !obj.closingDate ||
                                        DateCheck.today().isNotAfter(
                                            obj.closingDate
                                        )
                                )
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
                                .filter(
                                    (obj) =>
                                        !obj.closingDate ||
                                        DateCheck.today().isNotAfter(
                                            obj.closingDate
                                        )
                                )
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
                        variant="primary"
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

export default TransactionFormPage
