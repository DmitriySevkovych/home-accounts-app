/*
    Information on gracefully shutting down a Next.js server
        - https://nextjs.org/docs/deployment#manual-graceful-shutdowns
        - https://github.com/vercel/next.js/discussions/38735
 */
import { Html, Head, Main, NextScript } from 'next/document'

import { addShutdownSignalHandlers } from './_gracefulShutdown'

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
    addShutdownSignalHandlers('document')
}

const Document = () => {
    return (
        <Html>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
