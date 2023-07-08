import React from 'react'
import { Heading as ChakraHeading } from '@chakra-ui/react'

type HeadingProps = {
    label: string
}

export const Heading = (props: HeadingProps) => {
    const { label } = props
    return <ChakraHeading>{label}</ChakraHeading>
}
