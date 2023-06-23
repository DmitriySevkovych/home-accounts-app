import React from 'react'

type SelectProps = {
    label: string
    id: string
    selectedState: string | undefined
    setSelectedState: (newState: string) => void
    options: string[]
}

export default function Select(props: SelectProps) {
    const { label, id, selectedState, setSelectedState, options } = props
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <select
                name={id}
                id={id}
                value={selectedState}
                onChange={(e) => {
                    setSelectedState(e.target.value)
                }}
            >
                <option disabled selected>
                    {' -- select an option -- '}
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </>
    )
}
