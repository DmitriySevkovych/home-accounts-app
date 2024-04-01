import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { PAGES } from '../../helpers/routes'
import { Button } from '../../lib/shadcn/Button'
import { MainHeading } from '../Typography'

type PageProps = {
    children: React.ReactNode
    heading: string
    goBackLink: string
}

export const PageWithBackButton: React.FC<PageProps> = ({
    children,
    heading,
    goBackLink,
}) => {
    return (
        <main className="relative mx-auto  max-w-4xl bg-background px-3 pb-12 text-darkest md:py-8">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-inherit py-3">
                <MainHeading>{heading}</MainHeading>
                <Link href={goBackLink}>
                    <Button
                        className="min-w-[40px] p-0"
                        variant="secondary"
                        type="button"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
            </div>

            {children}
        </main>
    )
}
