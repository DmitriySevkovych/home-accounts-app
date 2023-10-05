import App, { AppContext, AppInitialProps, AppProps } from 'next/app'
import Head from 'next/head'

import Toaster from '../components/Toaster'
import '../styles/globals.css'

export default function MyApp({
    Component,
    pageProps,
    title,
}: { title: string } & AppProps) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <meta name="description" content="Description" />
                <meta name="keywords" content="Keywords" />
                <title>{title}</title>

                <link rel="manifest" href="/manifest.json" />
                <link
                    href="/icons/favicon-16x16.png"
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                />
                <link
                    href="/icons/favicon-32x32.png"
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                />
                <link rel="apple-touch-icon" href="/apple-icon.png"></link>
                <meta name="theme-color" content="#317EFB" />
            </Head>
            <Component {...pageProps} />
            <Toaster />
        </>
    )
}

MyApp.getInitialProps = async (
    context: AppContext
): Promise<{ title: string } & AppInitialProps> => {
    const ctx = await App.getInitialProps(context)

    let title = 'Home Accounts App'
    if (process.env['APP_ENV'] === 'development') title = `DEV: ${title}`
    else if (process.env['APP_ENV'] === 'stage') title = `STAGE: ${title}`
    else if (process.env['APP_ENV'] === 'production') title = `PROD: ${title}`

    return { ...ctx, title }
}
