import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Transaction } from 'domain-model'
import { FormField, FormItem, FormLabel, FormMessage } from '../lib/shadcn/Form'
import { Input } from '../lib/shadcn/Input'
import { Textarea } from '../lib/shadcn/Textarea'

type InputProps = {
    form: UseFormReturn<Transaction, any, undefined>
    label: string
    id: keyof Transaction
    placeholder?: string
    isRequired?: boolean
}

export const TextInput = (props: InputProps) => {
    const { form, label, id, placeholder, isRequired } = props
    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Input
                        onChange={field.onChange}
                        value={field.value?.toString()}
                        type="text"
                        placeholder={placeholder}
                        required={isRequired}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const NumberInput = (props: InputProps) => {
    const { form, label, id, placeholder, isRequired } = props
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
                        // TODO fix type mismatch warning
                        value={field.value}
                        placeholder={placeholder || ''}
                        required={isRequired}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const TextAreaInput = (props: InputProps) => {
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
