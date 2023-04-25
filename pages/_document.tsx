/*
    Information on gracefully shutting down a Next.js server
        - https://nextjs.org/docs/deployment#manual-graceful-shutdowns
        - https://github.com/vercel/next.js/discussions/38735
        - Run code once on server start: https://github.com/vercel/next.js/discussions/15341
 */
import { Html, Head, Main, NextScript } from 'next/document'

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
