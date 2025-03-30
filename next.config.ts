import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*.kakaocdn.net",
      },
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
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https:;",
    domains: ["43.203.93.186"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.figma.com;",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://43.203.93.186:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
