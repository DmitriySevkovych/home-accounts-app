import { TransactionType } from 'domain-model'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { MainHeading } from '../../../components/Typography'
import { PAGES } from '../../../helpers/routes'
import { Button } from '../../../lib/shadcn/Button'

type CongratsPageProps = {
    transactionType: TransactionType
}

const CongratsPage = ({ transactionType }: CongratsPageProps) => {
    const gifURL =
        transactionType === 'expense'
            ? 'https://media1.giphy.com/media/LS33kDnx38ZxWm0X2k/giphy.gif?cid=ecf05e475dgt0umidy04jd6lcp4we6lu0hy4hbu9u7lve0x8&ep=v1_gifs_search&rid=giphy.gif&ct=g'
            : 'https://media4.giphy.com/media/MFsqcBSoOKPbjtmvWz/giphy.gif?cid=ecf05e47yy0w3demdaj7n0rdaryw0e74d7yytj7d9p5wbbb5&ep=v1_gifs_search&rid=giphy.gif&ct=g'

    const caption =
        transactionType === 'expense' ? 'Money well spent😎' : 'Чеки растут🤑'
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-10">
            <MainHeading>{caption}</MainHeading>
            <Image
                className="rounded-full border-4 border-primary-foreground"
                width="480"
                height="480"
                alt={caption}
                src={gifURL}
                unoptimized
            />
            <Button type="button" size={'lg'}>
                <Link href={PAGES.transactions.index}>Go back</Link>
            </Button>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const { transactionType } = context.query
    return {
        props: {
            transactionType,
        },
    }
}

export default CongratsPage
