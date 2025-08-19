/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const targetApiUrl = process.env.NEXT_PUBLIC_ENV === 'development'
      ? "http://douxian.zhuzhu.pro:2285"
      : "http://prod-cn.your-api-server.com";
    return [
      {
        source: "/api/proxy/:path*", // 前端请求的路径
        destination: `${targetApiUrl}/:path*`, // 目标接口地址
      },
    ];
  },
};

module.exports = nextConfig;
