/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const targetApiUrl = "http://www.douxian2.cn:2285";
    // const targetApiUrl = 'http://douxian.zhuzhu.pro:2285'

    return [
      {
        source: "/api/proxy/:path*",
        destination: `${targetApiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
