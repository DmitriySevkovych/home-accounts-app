import React from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '../../lib/shadcn/Button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../lib/shadcn/Form'
import { Transaction, TransactionDate, dummyTransaction } from 'domain-model'
import { Toast } from '../../lib/shadcn/Toast'
import { Input } from '../../lib/shadcn/Input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../lib/shadcn/Popover'
import { cn } from '../../helpers/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../../lib/shadcn/Calendar'

// Debug tool
import { DevTool } from '@hookform/devtools'
import { Textarea } from '../../lib/shadcn/Textarea'
import Radio from '../../components/Radio'
import Select from '../../components/Select'

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

console.log(
    FormSchema.safeParse(
        dummyTransaction('FOOD', -12.34, TransactionDate.today())
    )
)

export default function NewTransaction({
    transactionCategories,
    paymentMethods,
    bankAccounts,
    taxCategories,
}: NewTransactionPageProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    // const form = () => {
    //     const {
    //       control,
    //       handleSubmit,
    //       watch,
    //       formState: { errors },
    //     } = useForm<z.infer<typeof FormSchema>>({
    //       resolver: zodResolver(FormSchema),
    //     });

    // const onSubmit = (data: z.infer<typeof FormSchema>) => {
    //     console.log(data);
    //     alert('Data was submitted!')
    // }
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

                    {/* Origin */}
                    <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Origin</FormLabel>
                                <Input
                                    onChange={field.onChange}
                                    type="text"
                                    placeholder="Origin"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <Input
                                    onChange={field.onChange}
                                    type="text"
                                    placeholder="Description"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Amount */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <Input
                                    onChange={field.onChange}
                                    type="number"
                                    // TODO handle minus value
                                    placeholder="Manual minus value!"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Currency */}
                    <FormField
                        control={form.control}
                        name="currency"
                        defaultValue="EUR"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Input
                                    onChange={field.onChange}
                                    type="text"
                                    placeholder="Currency"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Exchange Rate */}
                    <FormField
                        control={form.control}
                        name="exchangeRate"
                        defaultValue={1}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Exchange Rate</FormLabel>
                                <Input
                                    onChange={field.onChange}
                                    type="number"
                                    placeholder="Exchange Rate"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Payment Method */}
                    <Select
                        id="paymentMethod"
                        form={form}
                        label="Payment Method"
                        options={paymentMethods}
                        isRequired
                        defaultValue={paymentMethods[1]}
                    />

                    {/* Source Bank Account */}
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

                    {/* Target Bank Account */}
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

                    {/* Tax Category */}
                    <Select
                        id="taxCategory"
                        form={form}
                        label="Tax Category"
                        options={taxCategories}
                    />

                    {/* Comment */}
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <Textarea
                                    onChange={field.onChange}
                                    placeholder="Comment"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
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
