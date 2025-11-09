/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   turbo: false,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // const targetApiUrl = 'http://dxadmin.douxian2.cn/douxian';
    const targetApiUrl = 'http://douxian.zhuzhu.pro:2285/douxian'

    return [
      {
        source: '/douxian/:path*',
        destination: `${targetApiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
