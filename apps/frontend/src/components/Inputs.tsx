import React, { ChangeEvent } from 'react'
import { TransactionDate } from 'domain-model'

type InputProps = {
    label: string
    id: string
    placeholder?: string
    isRequired?: boolean
}

type TextInputProps = InputProps & {
    state: string | undefined
    setState: (newState: string) => void
}

type NumberInputProps = InputProps & {
    state: number | undefined
    setState: (newState: number) => void
}

type DateInputProps = InputProps & {
    state: TransactionDate
    setState: (newState: TransactionDate) => void
}

export const TextInput = (props: TextInputProps) => {
    const { label, id, placeholder, state, setState, isRequired } = props
    return (
        <p>Text input under development</p>
        // <FormControl id={id}>
        //     <FormLabel>{label}</FormLabel>
        //     <ChakraInput
        //         isRequired={isRequired}
        //         type="text"
        //         placeholder={placeholder}
        //         value={state}
        //         onChange={(e: ChangeEvent<HTMLInputElement>) => {
        //             setState(e.target.value)
        //         }}
        //     />
        // </FormControl>
    )
}

export const NumberInput = (props: NumberInputProps) => {
    const { label, id, placeholder, state, setState, isRequired } = props
    return (
        <p>Text input under development</p>
        // <FormControl id={id}>
        //     <FormLabel>{label}</FormLabel>
        //     <ChakraInput
        //         isRequired={isRequired}
        //         type="number"
        //         placeholder={placeholder}
        //         value={state}
        //         onChange={(e: ChangeEvent<HTMLInputElement>) => {
        //             setState(parseFloat(e.target.value))
        //         }}
        //     />
        // </FormControl>
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
