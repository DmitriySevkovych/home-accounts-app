// const nextPWA = require('next-pwa')
// const runtimeCaching = require('next-pwa/cache.js')

// // const signals = ['SIGTERM', 'SIGINT']

// // https://github.com/shadowwalker/next-pwa
// const withPWA = nextPWA({
//     // Next-PWA specific config
//     dest: 'public',
//     sw: 'service-worker.js',
//     disable: process.env.NODE_ENV !== 'production',
//     runtimeCaching,
// })

// // Build configuration: https://nextjs.org/docs/api-reference/next.config.js/introduction
// module.exports = withPWA({
//     // Next.js config
//     reactStrictMode: true,
//     output: 'standalone',
//     images: {
//         domains: ['media1.giphy.com', 'media4.giphy.com'],
//     },
//     poweredByHeader: false,
// })

// Build configuration: https://nextjs.org/docs/api-reference/next.config.js/introduction
module.exports = {
    // Next.js config
    reactStrictMode: true,
    output: 'standalone',
    images: {
        domains: ['media1.giphy.com', 'media4.giphy.com'],
    },
    poweredByHeader: false,
}
