import React from 'react'
import { Puff } from 'react-loader-spinner'

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

export const SectionHeading: React.FC<HeadingProps> = ({
    className,
    children,
}) => {
    return (
        <h2
            className={cn(
                'text-md mb-2 font-bold text-primary lg:text-xl',
                className
            )}
        >
            {children}
        </h2>
    )
}

export const Loader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
}) => {
    return (
        <div
            className={cn(
                'flex h-full w-full items-center justify-center p-3',
                className
            )}
        >
            <Puff
                visible={true}
                height="36"
                width="36"
                color="#6F7094"
                ariaLabel="puff-loading"
            />
        </div>
    )
}

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    error: any
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    className,
    error,
}) => {
    return (
        <div className={cn('h-full w-full text-destructive', className)}>
            Error: {error}
        </div>
    )
}
