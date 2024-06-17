// import { DevTool } from '@hookform/devtools'
import {
    BankAccount,
    DateCheck,
    Investment,
    PaymentMethod,
    PickAndFlatten,
    ProjectInvoice,
    TaxCategory,
    Transaction,
    TransactionCategory,
    TransactionContext,
    TransactionReceipt,
    TransactionType,
} from 'domain-model'
import React from 'react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import useSWR from 'swr'

import { safeFetch } from '../../helpers/requests'
import { API, PAGES } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'
import { Form } from '../../lib/shadcn/Form'
import AutocompleteInput from '../AutocompleteInput'
import { Calendar } from '../Calendar'
import { DropzoneFormField } from '../Dropzone'
import { NumberInput, TextAreaInput, TextInput } from '../Inputs'
import OverlayImage from '../Overlay'
import Radio from '../Radio'
import Select from '../Select'
import TagsManager from '../TagsManager'
import { Loader } from '../Typography'
import { PageWithBackButton } from './PageWithBackButton'

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
    submitLabel: string
    allowZerosumTransactions?: boolean
}

export const fetchTransactionConstants = async () => {
    const urls = API.server.transactions.constants()

    const response = await Promise.all(
        urls.map((url) => safeFetch(url).then((res) => res.json()))
    )

    return {
        ...response[0],
        ...response[1],
        ...response[2],
        ...response[3],
    }
}

const _eligibleCategories = (
    categories: TransactionCategory[],
    type: TransactionType,
    context: TransactionContext
) => {
    if (type === 'expense') {
        return categories
            .filter((c) => c.canBeExpense && c.context === context)
            .map((obj) => obj.category)
            .sort()
    } else if (type === 'income') {
        return categories
            .filter((c) => c.canBeIncome && c.context === context)
            .map((obj) => obj.category)
            .sort()
    } else if (type === 'zerosum') {
        return categories
            .filter((c) => c.isZerosum)
            .map((obj) => obj.category)
            .sort()
    } else {
        throw new Error(`Unknown transaction type ${type}`)
    }
}

const _fetchReceiptName = async (
    receiptId: number
): Promise<PickAndFlatten<TransactionReceipt, 'name'>> => {
    if (!receiptId) return ''

    const res = await safeFetch(
        API.client.transactions.receipts.getNameOf(receiptId)
    )
    const data: TransactionReceipt = await res.json()
    return data.name
}

const TransactionFormPage: React.FC<TransactionFormPageProps> = ({
    heading,
    form,
    constants,
    onSubmit,
    submitLabel,
    allowZerosumTransactions,
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

    const receiptId = form.watch('receiptId')
    const {
        data: receiptName,
        error: errorLoadingReceiptName,
        isLoading: isLoadingReceiptName,
    } = useSWR(receiptId, _fetchReceiptName)

    const transactionTypeOptions = [
        { label: 'Expense', value: 'expense' },
        { label: 'Income', value: 'income' },
    ]
    if (allowZerosumTransactions) {
        transactionTypeOptions.push({ label: 'Zero-Sum', value: 'zerosum' })
    }

    return (
        <PageWithBackButton
            heading={heading}
            goBackLink={PAGES.transactions.index}
        >
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
                            options={transactionTypeOptions}
                            label="Transaction type"
                        />
                    </div>

                    <Select<Transaction>
                        id="category"
                        form={form}
                        label="Category"
                        options={_eligibleCategories(
                            transactionCategories,
                            transactionType,
                            transactionContext
                        )}
                    />

                    <AutocompleteInput
                        id="origin"
                        form={form}
                        label="Origin"
                        autocompleteOptions={transactionOrigins}
                    />

                    <TextInput
                        id="description"
                        form={form}
                        label="Description"
                    />

                    <Calendar<Transaction>
                        id="date"
                        form={form}
                        label="Transaction date"
                    />

                    <NumberInput id="amount" form={form} label="Amount" />

                    <TextInput id="currency" form={form} label="Currency" />

                    <NumberInput
                        id="exchangeRate"
                        form={form}
                        label="Exchange Rate"
                    />

                    <Select<Transaction>
                        id="paymentMethod"
                        form={form}
                        label="Payment Method"
                        options={paymentMethods.map((obj) => obj.method).sort()}
                    />

                    {transactionType !== 'income' && (
                        <Select<Transaction>
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

                    {transactionType !== 'expense' && (
                        <Select<Transaction>
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

                    <Select<Transaction>
                        id="taxCategory"
                        form={form}
                        label="Tax Category"
                        options={taxCategories
                            .map((obj) => obj.category)
                            .sort()}
                        clearable
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
                            <Select<Transaction>
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
                                        placeholder="Enter a number between 0 and 1, e.g. 0.19"
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
                                <Select<Transaction>
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
                        <TagsManager
                            id="tags"
                            form={form}
                            label="Tags"
                            initialTags={tags}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <DropzoneFormField
                            id="receipt"
                            form={form}
                            label="Transaction receipt"
                        />
                        {errorLoadingReceiptName && (
                            <div>{errorLoadingReceiptName}</div>
                        )}
                        {isLoadingReceiptName && <Loader />}
                        {receiptName && (
                            <div>
                                ⚠️Found a stored receipt with ID {receiptId}⚠️
                                <br />
                                {receiptName}
                            </div>
                        )}
                    </div>

                    <Button
                        className="flex w-full md:ml-auto md:mr-0 md:w-auto lg:col-span-2"
                        variant="primary"
                        type="submit"
                        size={'lg'}
                    >
                        {submitLabel}
                    </Button>
                </form>
            </Form>
            <OverlayImage />
            {/* <DevTool control={form.control} /> */}
        </PageWithBackButton>
    )
}

export default TransactionFormPage
