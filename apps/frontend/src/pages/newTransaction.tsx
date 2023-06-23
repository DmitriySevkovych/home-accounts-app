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
            <h1>Create Transaction</h1>
            <div>
                <form onSubmit={postNewTransaction}>
                    <label htmlFor="category">Category</label>
                    <select
                        name="category"
                        id="category"
                        defaultValue={'FOOD'}
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value)
                        }}
                    >
                        {transactionCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="origin">Origin</label>
                    <input
                        id="origin"
                        type="text"
                        placeholder="origin"
                        value={origin}
                        onChange={(e) => {
                            setOrigin(e.target.value)
                        }}
                    />

                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        type="text"
                        placeholder="description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    />

                    <label htmlFor="transactionDate">Transaction date:</label>
                    <input
                        type="date"
                        id="transactionDate"
                        name="transactionDate"
                        value={date.toString()}
                        onChange={(e) => {
                            setDate(TransactionDate.fromString(e.target.value))
                        }}
                    />

                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => {
                            setAmount(parseFloat(e.target.value))
                        }}
                    />

                    <label htmlFor="currency">Currency</label>
                    <input
                        type="text"
                        id="currency"
                        value={currency}
                        onChange={(e) => {
                            setCurrency(e.target.value)
                        }}
                    />

                    <label htmlFor="exchangeRate">Exchange Rate</label>
                    <input
                        type="number"
                        id="exchangeRate"
                        value={exchangeRate}
                        onChange={(e) => {
                            setExchangeRate(parseFloat(e.target.value))
                        }}
                    />

                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                        name="paymentMethod"
                        id="paymentMethod"
                        value={selectedPaymentMethod}
                        onChange={(e) => {
                            setSelectedPaymentMethod(e.target.value)
                        }}
                    >
                        {paymentMethods.map((paymentMethod) => (
                            <option key={paymentMethod} value={paymentMethod}>
                                {paymentMethod}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="sourceBankAccount">
                        Source Bank Account
                    </label>
                    <select
                        name="sourceBankAccount"
                        id="sourceBankAccount"
                        value={selectedSourceBankAccount}
                        onChange={(e) => {
                            setSelectedSourceBankAccount(e.target.value)
                        }}
                    >
                        {bankAccounts.map((bankAccount) => (
                            <option key={bankAccount} value={bankAccount}>
                                {bankAccount}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="targetBankAccount">
                        Target Bank Account
                    </label>
                    <select
                        name="targetBankAccount"
                        id="targetBankAccount"
                        value={selectedTargetBankAccount}
                        onChange={(e) => {
                            setSelectedTargetBankAccount(e.target.value)
                        }}
                    >
                        {bankAccounts.map((bankAccount) => (
                            <option key={bankAccount} value={bankAccount}>
                                {bankAccount}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="taxCategory">Tax Category</label>
                    <select
                        name="taxCategory"
                        id="taxCategory"
                        value={selectedTaxCategory}
                        onChange={(e) => {
                            setSelectedTaxCategory(e.target.value)
                        }}
                    >
                        {taxCategories.map((taxCategory) => (
                            <option key={taxCategory} value={taxCategory}>
                                {taxCategory}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="comment">Comment</label>
                    <textarea
                        name="comment"
                        id="comment"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value)
                        }}
                    />

                    <p>Select specifics</p>
                    <input
                        type="radio"
                        id="NoSpecifics"
                        name="specifics"
                        value="NoSpecifics"
                        defaultChecked
                    />
                    <label htmlFor="NoSpecifics">None</label>
                    <input
                        type="radio"
                        id="WorkSpecifics"
                        name="specifics"
                        value="WorkSpecifics"
                    />
                    <label htmlFor="WorkSpecifics">WorkSpecifics</label>
                    <input
                        type="radio"
                        id="InvestmentSpecifics"
                        name="specifics"
                        value="InvestmentSpecifics"
                    />
                    <label htmlFor="InvestmentSpecifics">
                        InvestmentSpecifics
                    </label>

                    <label htmlFor="newTag">New tag</label>
                    <input
                        id="newTag"
                        type="text"
                        placeholder="new tag"
                        value={tags} // TODO: introduce newTag as state ... currently we are using the wrong variable here
                        onChange={(e) => {
                            // TODO: implement the following
                            // setNewTag(e.target.value)

                            // TODO: this action should happen when a 'add new tag' button is clicked
                            const updatedTags = [...tags, e.target.value]
                            setTags(updatedTags)
                        }}
                    />
                    {/* TODO add a button for 'add new tag' here */}
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
