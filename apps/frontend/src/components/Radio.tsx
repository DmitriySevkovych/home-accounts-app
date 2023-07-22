import React, { ChangeEvent } from 'react'

type RadioProps<T> = {
    label: string
    id: string
    selectedOption: T | undefined
    setSelectedOption: (newOption: T) => void
    options: RadioOption[]
}

type RadioOption = {
    label: string
    value: string
}

const Radio = <T extends string>(props: RadioProps<T>) => {
    const { label, options, selectedOption, setSelectedOption, id } = props
    return (
        <p>Radio under development</p>
        // <FormControl id={id}>
        //     <FormLabel>{label}</FormLabel>
        //     <RadioGroup onChange={setSelectedOption} value={selectedOption}>
        //         <Stack direction="row">
        //             {options.map((option) => (
        //                 <ChakraRadio key={option.value} value={option.value}>
        //                     {option.label}
        //                 </ChakraRadio>
        //             ))}
        //         </Stack>
        //     </RadioGroup>
        // </FormControl>
    )
}

export default Radio
