import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Transaction, TransactionDate } from 'domain-model'
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

type TextInputProps = InputProps & {
    defaultValue?: string
}

type NumberInputProps = InputProps & {
    defaultValue?: number
}

type DateInputProps = InputProps & {
    state: TransactionDate
    setState: (newState: TransactionDate) => void
}

export const TextInput = (props: TextInputProps) => {
    const { form, label, id, placeholder, isRequired, defaultValue } = props
    return (
        <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Input
                        onChange={field.onChange}
                        type="text"
                        placeholder={placeholder}
                        required={isRequired}
                        defaultValue={defaultValue || ''}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const NumberInput = (props: NumberInputProps) => {
    const { form, label, id, placeholder, isRequired, defaultValue } = props
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
                        defaultValue={defaultValue}
                        placeholder={placeholder || ''}
                        required={isRequired}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const DateInput = (props: DateInputProps) => {
    const { label, id, state, setState, isRequired } = props
    return (
        <p>Text input under development</p>
        // <FormControl id={id}>
        //     <FormLabel>{label}</FormLabel>
        //     <ChakraInput
        //         isRequired={isRequired}
        //         type="date"
        //         value={state.toString()}
        //         onChange={(e: ChangeEvent<HTMLInputElement>) => {
        //             setState(TransactionDate.fromString(e.target.value))
        //         }}
        //     />
        // </FormControl>
    )
}

export const TextAreaInput = (props: TextInputProps) => {
    const { form, label, id, placeholder, isRequired, defaultValue } = props
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
