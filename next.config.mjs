/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: process.env.AWS_S3_BUCKET_HOST,
        pathname: "/**/*",
      },
    ],
  },
};

export default nextConfig;
