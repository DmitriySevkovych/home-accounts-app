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
import { Transaction } from 'domain-model'

type RadioProps = {
    form: UseFormReturn<any, any, undefined>
    id: keyof Transaction
    options: RadioOption[]
    label?: string
}

type RadioOption = {
    label: string
    value: string
}

const Radio: React.FC<RadioProps> = (props: RadioProps) => {
    const { form, id, options, label } = props
    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    {label && <FormLabel>Select transaction context</FormLabel>}
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

export default Radio
