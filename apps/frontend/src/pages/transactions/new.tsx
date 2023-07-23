import React from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '../../lib/shadcn/Button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../lib/shadcn/Form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../lib/shadcn/Select'
import { Transaction, TransactionDate, dummyTransaction } from 'domain-model'

const FormSchema = z.instanceof(Transaction)

// FormSchema.refine()

console.log(
    FormSchema.safeParse(
        dummyTransaction('FOOD', -12.34, TransactionDate.today())
    )
)

const NewTransaction = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    // const onSubmit = (data: z.infer<typeof FormSchema>) => {
    //     console.log(data);
    //     alert('Data was submitted!')
    // }
    const onSubmit = () => {
        alert('Data was submitted!')
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="m@example.com">
                                            m@example.com
                                        </SelectItem>
                                        <SelectItem value="m@google.com">
                                            m@google.com
                                        </SelectItem>
                                        <SelectItem value="m@support.com">
                                            m@support.com
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    You can manage email addresses in your{' '}
                                    <Link href="/examples/forms">
                                        email settings
                                    </Link>
                                    .
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default NewTransaction
