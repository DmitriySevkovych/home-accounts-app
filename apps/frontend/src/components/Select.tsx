import React from 'react'
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../lib/shadcn/Select'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../lib/shadcn/Form'
import { UseFormReturn } from 'react-hook-form'
import { Transaction } from 'domain-model'

type SelectProps = {
    form: UseFormReturn<Transaction, any, undefined>
    label: string
    id: keyof Transaction
    options: string[]
    isRequired?: boolean
}

export default function Select(props: SelectProps) {
    const { form, label, id, options, isRequired } = props

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <ShadcnSelect
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                        required={isRequired}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </ShadcnSelect>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
