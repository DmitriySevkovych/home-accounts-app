import {
    BankAccount,
    PaymentMethod,
    TaxCategory,
    TransactionCategory,
    TransactionDate,
    createTransaction,
} from 'domain-model'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Select from '../components/Select'
import TagInput from '../components/TagInput'
import { TextInput, NumberInput, DateInput } from '../components/Inputs'
import Radio from '../components/Radio'
import { Heading } from '../components/Typography'

type NewTransactionPageProps = {
    transactionCategories: string[]
    paymentMethods: string[]
    bankAccounts: string[]
    taxCategories: string[]
}

const baseUrl = `${process.env['NEXT_PUBLIC_BACKEND_URL']}/${process.env['NEXT_PUBLIC_BACKEND_API_BASE']}`

export default function NewTransactionPage({
    transactionCategories,
    paymentMethods,
    bankAccounts,
    taxCategories,
}: NewTransactionPageProps) {
    const router = useRouter()

    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >(undefined)
    const [origin, setOrigin] = useState<string | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(
        undefined
    )
    const [date, setDate] = useState<TransactionDate>(TransactionDate.today())
    const [amount, setAmount] = useState<number>(0)
    const [currency, setCurrency] = useState<string>('EUR')
    const [exchangeRate, setExchangeRate] = useState<number>(1)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        string | undefined
    >(undefined)
    const [selectedSourceBankAccount, setSelectedSourceBankAccount] = useState<
        string | undefined
    >(undefined)
    const [selectedTargetBankAccount, setSelectedTargetBankAccount] = useState<
        string | undefined
    >(undefined)
    const [selectedTaxCategory, setSelectedTaxCategory] = useState<
        string | undefined
    >(undefined)
    const [comment, setComment] = useState<string | undefined>(undefined)
    const [tags, setTags] = useState<string[]>([])
    const [specifics, setSpecifics] = useState<string>('NoSpecifics')
    const [cashflow, setCashflow] = useState<string>('expense')

    const newTransaction = () => {
        const transaction = createTransaction()
            .about(selectedCategory!, origin!, description!)
            .withAmount(amount)
            .withCurrency(currency, exchangeRate)
            .withDate(date)
            .withPaymentDetails(
                selectedPaymentMethod!,
                selectedSourceBankAccount!,
                selectedTargetBankAccount!
            )
            .withComment(comment!)
            .withAgent('development-agent')
            .addTags(tags)
            // .withSpecifics(selectedCategory!)
            .validate()
            .build()
        return transaction
    }

    const postNewTransaction = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        const response = await fetch(`${baseUrl}/transactions`, {
            method: 'POST',
            // mode: "cors", // no-cors, *cors, same-origin
            // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            // redirect: "follow", // manual, *follow, error
            // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(newTransaction()), // body data type must match "Content-Type" header
        })
        if (response.status !== 201) {
            alert('Transaction was not created')
        } else {
            router.push('/')
        }
    }

    return (
        <>
            <Heading label="Create Transaction" />
            <div>
                <form onSubmit={postNewTransaction}>
                    <Radio
                        label="Select transaction cashflow"
                        id="cashflow"
                        selectedOption={cashflow}
                        setSelectedOption={setCashflow}
                        options={[
                            { label: 'Expense', value: 'expense' },
                            { label: 'Income', value: 'income' },
                        ]}
                    />

                    <Select
                        isRequired
                        label="Category"
                        id="category"
                        selectedState={selectedCategory}
                        setSelectedState={setSelectedCategory}
                        options={transactionCategories}
                    />

                    <TextInput
                        isRequired
                        label="Origin"
                        id="origin"
                        placeholder="origin"
                        state={origin}
                        setState={setOrigin}
                    />

                    <TextInput
                        label="Description"
                        id="description"
                        placeholder="description"
                        state={description}
                        setState={setDescription}
                    />

                    <DateInput
                        isRequired
                        label="Transaction date"
                        id="transactionDate"
                        state={date}
                        setState={setDate}
                    />

                    <NumberInput
                        label="Amount"
                        id="amount"
                        state={amount}
                        setState={setAmount}
                    />

                    <TextInput
                        label="Currency"
                        id="currency"
                        placeholder="description"
                        state={currency}
                        setState={setCurrency}
                    />

                    <NumberInput
                        label="Exchange Rate"
                        id="exchangeRate"
                        state={exchangeRate}
                        setState={setExchangeRate}
                    />

                    <Select
                        isRequired
                        label="Payment Method"
                        id="paymentMethod"
                        selectedState={selectedPaymentMethod}
                        setSelectedState={setSelectedPaymentMethod}
                        options={paymentMethods}
                    />

                    {/* TODO merge to one bank account component */}
                    <Select
                        isRequired
                        label="Source Bank Account"
                        id="sourceBankAccount"
                        selectedState={selectedSourceBankAccount}
                        setSelectedState={setSelectedSourceBankAccount}
                        options={bankAccounts}
                    />

                    <Select
                        label="Target Bank Account"
                        id="targetBankAccount"
                        selectedState={selectedTargetBankAccount}
                        setSelectedState={setSelectedTargetBankAccount}
                        options={bankAccounts}
                    />

                    <Select
                        label="Tax Category"
                        id="taxCategory"
                        selectedState={selectedTaxCategory}
                        setSelectedState={setSelectedTaxCategory}
                        options={taxCategories}
                    />

                    {/* TODO Extract into new TextArea component */}
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        name="comment"
                        id="comment"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value)
                        }}
                    />

                    <Radio
                        label="Select specifics"
                        id="transaction-specifics"
                        selectedOption={specifics}
                        setSelectedOption={setSpecifics}
                        options={[
                            { label: 'None', value: 'NoSpecifics' },
                            { label: 'Work', value: 'WorkSpecifics' },
                            {
                                label: 'Investment',
                                value: 'InvestmentSpecifics',
                            },
                        ]}
                    />

                    <TagInput tags={tags} setTags={setTags} />
                    <div>
                        {tags.map((tag) => (
                            <div key={tag}>{tag}</div>
                        ))}
                    </div>

                    <button type="submit">Create</button>
                </form>
            </div>
        </>
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
