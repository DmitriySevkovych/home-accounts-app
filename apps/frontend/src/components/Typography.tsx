import React from 'react'

import { cn } from '../helpers/utils'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const MainHeading: React.FC<HeadingProps> = ({
    className,
    children,
}) => {
    return (
        <h1
            className={cn(
                'py-6 text-xl font-bold leading-none text-primary lg:text-2xl',
                className
            )}
        >
            {children}
        </h1>
    )
}
