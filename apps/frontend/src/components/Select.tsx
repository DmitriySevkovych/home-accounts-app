import React from 'react'
import {
    FormControl,
    FormLabel,
    Select as ChakraSelect,
} from '@chakra-ui/react'

type SelectProps = {
    label: string
    id: string
    selectedState: string | undefined
    setSelectedState: (newState: string) => void
    options: string[]
    isRequired?: boolean
}

export default function Select(props: SelectProps) {
    const { label, id, selectedState, setSelectedState, options, isRequired } =
        props
    return (
        <FormControl id={id}>
            <FormLabel>{label}</FormLabel>
            <ChakraSelect
                placeholder={`Select ${label}`}
                isRequired={isRequired}
                value={selectedState}
                defaultValue=""
                onChange={(e) => {
                    setSelectedState(e.target.value)
                }}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </ChakraSelect>
        </FormControl>
    )
}
