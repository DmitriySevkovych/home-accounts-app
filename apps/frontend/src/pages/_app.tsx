import App, { AppContext, AppInitialProps, AppProps } from 'next/app'
import Head from 'next/head'

import Toaster from '../components/Toaster'
import { ClientContext, ClientContextProps } from '../helpers/clientContext'
import '../styles/globals.css'

export default function MyApp({
    Component,
    pageProps,
    clientContext,
}: { clientContext: ClientContextProps } & AppProps) {
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
                <title>{_getTitle(clientContext.appEnvironment)}</title>

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
            <ClientContext.Provider value={clientContext}>
                <Component {...pageProps} />
                <Toaster />
            </ClientContext.Provider>
        </>
    )
}

MyApp.getInitialProps = async (
    context: AppContext
): Promise<{ clientContext: ClientContextProps } & AppInitialProps> => {
    const ctx = await App.getInitialProps(context)

    const clientContext: ClientContextProps = {
        appEnvironment: process.env['APP_ENV']!,
        backend: {
            host: process.env['CLIENT_BACKEND_HOST']!,
            apiBase: process.env['BACKEND_API_BASE']!,
            apiKey: process.env['BACKEND_API_KEY']!,
        },
    }
    return { ...ctx, clientContext }
}

const _getTitle = (appEnv: string): string => {
    let title = 'Home Accounts App'
    switch (appEnv) {
        case 'production':
            return `PROD: ${title}`
        case 'stage':
            return `STAGE: ${title}`
        case 'development':
            return `DEV: ${title}`
        default:
            throw new Error(`Illegal application environment '${appEnv}`)
    }
}
