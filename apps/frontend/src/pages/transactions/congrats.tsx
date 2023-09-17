import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { PAGES } from '../../helpers/pages'
import { Button } from '../../lib/shadcn/Button'

const Congrats = () => {
    const router = useRouter()
    const { transactionType } = router.query

    const gifURL =
        transactionType === 'expense'
            ? 'https://media1.giphy.com/media/LS33kDnx38ZxWm0X2k/giphy.gif?cid=ecf05e475dgt0umidy04jd6lcp4we6lu0hy4hbu9u7lve0x8&ep=v1_gifs_search&rid=giphy.gif&ct=g'
            : 'https://media4.giphy.com/media/MFsqcBSoOKPbjtmvWz/giphy.gif?cid=ecf05e47yy0w3demdaj7n0rdaryw0e74d7yytj7d9p5wbbb5&ep=v1_gifs_search&rid=giphy.gif&ct=g'

    const heading =
        transactionType === 'expense' ? 'Money well spent😎' : 'Чеки растут🤑'
    return (
        <div className="min-h-screen w-full h-full flex flex-col gap-10 justify-center items-center">
            <h1 className="font-bold text-xl lg:text-2xl text-primary">
                {heading}
            </h1>
            <Image
                className="rounded-full border-4 border-primary-foreground"
                width="480"
                height="480"
                alt="Money well spent!"
                src={gifURL}
            />
            <Button type="button" size={'lg'}>
                <Link href={PAGES.transactions.index}>Go back</Link>
            </Button>
        </div>
    )
}

export default Congrats
