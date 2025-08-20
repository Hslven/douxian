/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build', // 👈 自定义输
  // 出目录名
  experimental: {
    turbo: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const targetApiUrl =
      process.env.NEXT_PUBLIC_ENV === 'development'
        ? 'http://douxian.zhuzhu.pro:2285'
        : 'http://prod-cn.your-api-server.com';

    return [
      {
        source: '/api/proxy/:path*',
        destination: `${targetApiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;