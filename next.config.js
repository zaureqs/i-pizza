/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "i-pizza-data.s3.amazonaws.com",
        pathname: '/profile-pictures\/.*/',
      },
    ],
  },
};

module.exports = nextConfig;
