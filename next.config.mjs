/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tgdd.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'recipesbymary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yeutre.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tgdd.vn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;