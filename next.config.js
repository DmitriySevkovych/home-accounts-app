import nextPWA from 'next-pwa'
import runtimeCaching from 'next-pwa/cache.js'

// Build configuration: https://nextjs.org/docs/api-reference/next.config.js/introduction
const configuration = () => {
    // Run code once on server start: https://github.com/vercel/next.js/discussions/15341
    // TODO

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
