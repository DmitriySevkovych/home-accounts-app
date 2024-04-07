import React from 'react'
import { UseFormReturn } from 'react-hook-form'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../lib/shadcn/Form'
import { RadioGroup, RadioGroupItem } from '../lib/shadcn/Radio'

type RadioProps<T> = {
    form: UseFormReturn<any, any>
    id: keyof T
    options: RadioOption[]
    label?: string
}

type RadioOption = {
    label: string
    value: string
}

export default function Radio<T>(props: RadioProps<T>) {
    const { form, id, options, label } = props
    return (
        <FormField
            control={form.control}
            name={id as string}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-3"
                        >
                            {options.map((option) => (
                                <FormItem
                                    key={option.value}
                                    className="flex items-center space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
