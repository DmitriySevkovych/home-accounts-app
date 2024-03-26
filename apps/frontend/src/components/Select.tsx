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
import { ScrollArea } from '../lib/shadcn/ScrollArea'
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select as ShadcnSelect,
} from '../lib/shadcn/Select'

type SelectProps<T> = {
    form: UseFormReturn<any, any>
    label: string
    id: keyof T
    options: string[]
}

export default function Select<T>(props: SelectProps<T>) {
    const { form, label, id, options } = props

    return (
        <FormField
            control={form.control}
            name={id as string}
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
                        <ScrollableSelectContent options={options} />
                    </ShadcnSelect>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

const ScrollableSelectContent: React.FC<{ options: string[] }> = ({
    options,
}) => {
    // If there are more than 6 selection options, add a scroll area.
    // Otherwise the content is neat as is, and the fixed scroll area height is annoying rather than helpful.
    if (options.length > 6) {
        return (
            <SelectContent>
                <ScrollArea className="h-[190px]">
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </ScrollArea>
            </SelectContent>
        )
    }

    return (
        <SelectContent>
            {options.map((option) => (
                <SelectItem key={option} value={option}>
                    {option}
                </SelectItem>
            ))}
        </SelectContent>
    )
}
