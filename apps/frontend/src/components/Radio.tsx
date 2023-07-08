import {
    Radio as ChakraRadio,
    FormControl,
    FormLabel,
    RadioGroup,
    Stack,
} from '@chakra-ui/react'

import React, { ChangeEvent } from 'react'

type RadioProps = {
    label: string
    id: string
    selectedOption: string | undefined
    setSelectedOption: (newOption: string) => void
    options: RadioOption[]
}

type RadioOption = {
    label: string
    value: string
}

const Radio = (props: RadioProps) => {
    const { label, options, selectedOption, setSelectedOption, id } = props
    return (
        <FormControl id={id}>
            <FormLabel>{label}</FormLabel>
            <RadioGroup onChange={setSelectedOption} value={selectedOption}>
                <Stack direction="row">
                    {options.map((option) => (
                        <ChakraRadio key={option.value} value={option.value}>
                            {option.label}
                        </ChakraRadio>
                    ))}
                </Stack>
            </RadioGroup>
        </FormControl>
    )
}

export default Radio
