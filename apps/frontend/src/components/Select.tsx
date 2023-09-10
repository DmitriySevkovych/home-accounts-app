import { Transaction } from 'domain-model'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../lib/shadcn/Form'
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select as ShadcnSelect,
} from '../lib/shadcn/Select'

type SelectProps = {
    form: UseFormReturn<any, any, undefined>
    label: string
    id: keyof Transaction
    options: string[]
}

export default function Select(props: SelectProps) {
    const { form, label, id, options } = props

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
