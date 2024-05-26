import Link from 'next/link'

import { cn } from '../../helpers/utils'
import { IconButton } from '../Buttons'
import { MainHeading } from '../Typography'

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    heading: string
    goBackLink: string
    stickyButton?: React.ReactNode
}

export const PageWithBackButton: React.FC<PageProps> = ({
    children,
    className,
    heading,
    goBackLink,
    stickyButton,
}) => {
    return (
        <main
            className={cn(
                'relative mx-auto max-w-4xl bg-background px-3 pb-12 text-darkest md:py-8',
                className
            )}
        >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-inherit py-3">
                <MainHeading>{heading}</MainHeading>
                <Link href={goBackLink}>
                    <IconButton action="back" />
                </Link>
            </div>

            {children}

            {stickyButton}
        </main>
    )
}
