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
import {
    Input,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
} from '@chakra-ui/react'

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
                    <Select
                        isRequired
                        label="Category"
                        id="category"
                        selectedState={selectedCategory}
                        setSelectedState={setSelectedCategory}
                        options={transactionCategories}
                    />

                    {/* TODO abstract chakra */}
                    <FormControl id="origin">
                        <FormLabel>Origin</FormLabel>
                        <Input
                            type="text"
                            placeholder="origin"
                            value={origin}
                            onChange={(e) => {
                                setOrigin(e.target.value)
                            }}
                        />
                    </FormControl>

                    <FormControl id="description">
                        <FormLabel>Description</FormLabel>
                        <Input
                            type="text"
                            placeholder="description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                        />
                    </FormControl>

                    <FormControl id="transactionDate">
                        <FormLabel>Transaction date:</FormLabel>
                        <Input
                            type="date"
                            name="transactionDate"
                            value={date.toString()}
                            onChange={(e) => {
                                setDate(
                                    TransactionDate.fromString(e.target.value)
                                )
                            }}
                        />
                    </FormControl>

                    <FormControl id="amount">
                        <FormLabel>Amount</FormLabel>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(parseFloat(e.target.value))
                            }}
                        />
                    </FormControl>

                    <FormControl id="currency">
                        <FormLabel>Currency</FormLabel>
                        <Input
                            type="text"
                            value={currency}
                            onChange={(e) => {
                                setCurrency(e.target.value)
                            }}
                        />
                    </FormControl>

                    <FormControl id="exchangeRate">
                        <FormLabel>Exchange Rate</FormLabel>
                        <Input
                            type="number"
                            value={exchangeRate}
                            onChange={(e) => {
                                setExchangeRate(parseFloat(e.target.value))
                            }}
                        />
                    </FormControl>

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

                    <label htmlFor="comment">Comment</label>
                    <textarea
                        name="comment"
                        id="comment"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value)
                        }}
                    />

                    <FormControl>
                        <FormLabel>Select specifics</FormLabel>
                        <RadioGroup
                        // onChange={setValue} value={value}
                        >
                            <Stack direction="row">
                                <Radio value="NoSpecifics">None</Radio>
                                <Radio value="WorkSpecifics">Work</Radio>
                                <Radio value="InvestmentSpecifics">
                                    Investment
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>

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
