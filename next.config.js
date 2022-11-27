/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  sw: 'service-worker.js',
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // config
  output: 'standalone',
})
