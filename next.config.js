import nextPWA from 'next-pwa'
import runtimeCaching from 'next-pwa/cache.js'

import { RepositoryLocator } from './src/db/repositoryLocator.js'

const signals = ['SIGTERM', 'SIGINT']

// Build configuration: https://nextjs.org/docs/api-reference/next.config.js/introduction
const configuration = () => {
    // Run code once on server start: https://github.com/vercel/next.js/discussions/15341
    if (process.env.NEXT_MANUAL_SIG_HANDLE) {
        // Windows workaround: https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
        // if (process.platform === 'win32') {
        //     logger.debug('Adding keypress handler for Ctrl-C on Windows')
        //     keypress(process.stdin)
        //     process.stdin.resume()
        //     process.stdin.setRawMode(true)
        //     process.stdin.setEncoding('utf8')
        //     process.stdin.on('keypress', (char, key) => {
        //         if (key && key.ctrl && key.name === 'c') {
        //             logger.debug(
        //                 'Received a Ctrl-C on Windows. Will emit SIGINT for further processing'
        //             )
        //             process.emit('SIGINT', 'SIGINT')
        //         }
        //     })
        // }

        signals.forEach((signal) => {
            console.log(`Adding signal handler for ${signal}`)
            process.on(signal, async () => {
                console.log(`Received ${signal}`)

                await RepositoryLocator.closeRepository()

                const timeout = Number(process.env.GRACEFUL_SHUTDOWN_TIMEOUT)
                setTimeout(
                    (...args) => {
                        console.warn(...args)
                        process.exit(1)
                    },
                    timeout,
                    `Signal ${signal} could not be processed correctly after ${timeout} milliseconds. Exiting hard.`
                )
                console.log(`Received ${signal}, end`)
            })
        })
    }

    // Configuring next-pwa: https://makerkit.dev/blog/tutorials/pwa-nextjs
    const withPWA = nextPWA({
        // Next-PWA specific config
        dest: 'public',
        sw: 'service-worker.js',
        disable: process.env.NODE_ENV !== 'production',
        runtimeCaching,
    })

    return withPWA({
        // Next.js config
        reactStrictMode: true,
        output: 'standalone',
    })
}

export default configuration
