/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/testing',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
