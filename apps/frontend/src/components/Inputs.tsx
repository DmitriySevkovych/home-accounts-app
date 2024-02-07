import React from 'react'
import { type UseFormReturn } from 'react-hook-form'

import { TransactionForm } from '../helpers/zod-form-schemas'
import { FormField, FormItem, FormLabel, FormMessage } from '../lib/shadcn/Form'
import { Input } from '../lib/shadcn/Input'
import { Textarea } from '../lib/shadcn/Textarea'

type InputProps = {
    id: keyof TransactionForm
    form: UseFormReturn<any, any>
    label: string
    placeholder?: string
}

export const TextInput: React.FC<InputProps> = (props) => {
    const { form, label, id, placeholder } = props

    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Input
                        onChange={field.onChange}
                        value={field.value?.toString() || ''}
                        type="text"
                        placeholder={placeholder}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const NumberInput: React.FC<InputProps> = (props) => {
    const { form, label, id, placeholder } = props
    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Input
                        onChange={field.onChange}
                        type="number"
                        value={field.value || ''}
                        placeholder={placeholder}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const TextAreaInput: React.FC<InputProps> = (props) => {
    const { form, label, id, placeholder } = props
    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Textarea
                        onChange={field.onChange}
                        placeholder={placeholder}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
