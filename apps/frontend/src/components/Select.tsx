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

type SelectProps = {
    form: UseFormReturn<FormData>
    label: string
    id: string
    defaultValue?: string | undefined
    options: string[]
    isRequired?: boolean
}

export default function Select(props: SelectProps) {
    const { form, label, id, defaultValue, options, isRequired } = props

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <ShadcnSelect
                        onValueChange={field.onChange}
                        defaultValue={defaultValue || ''}
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
