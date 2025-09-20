/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const targetApiUrl = 'http://douxian.zhuzhu.pro:2285'

    return [
      {
        source: '/api/proxy/:path*',
        destination: `${targetApiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;