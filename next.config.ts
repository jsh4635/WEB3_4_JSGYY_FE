import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "devcouse4-team07-bucket.s3.ap-northeast-2.amazonaws.com",
      }
    ],
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https:;",
    domains: [process.env.NEXT_PUBLIC_API_DOMAIN || "devcouse4-team07-bucket.s3.amazonaws.com"],
  },
};

export default nextConfig;
