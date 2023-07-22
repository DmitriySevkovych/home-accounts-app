import React from 'react'
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../lib/shadcn/Select'
import { Label } from '../lib/shadcn/Label'

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
        <ShadcnSelect
            value={selectedState}
            onValueChange={setSelectedState}
            required={isRequired}
            className="flex"
        >
            <Label htmlFor={id}>{label}</Label>
            <SelectTrigger id={id} className="w-[180px]">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </ShadcnSelect>
    )
}
