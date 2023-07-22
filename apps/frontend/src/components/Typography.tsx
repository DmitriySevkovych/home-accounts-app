import React from 'react'

type HeadingProps = {
    label: string
}

export const Heading = (props: HeadingProps) => {
    const { label } = props
    return <h1>{label}</h1>
}
