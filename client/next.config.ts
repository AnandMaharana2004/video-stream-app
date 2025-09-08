import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd11wd0j17w56pr.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Using a wildcard for subdomains
      },
      {
        protocol: 'https',
        hostname: 'www.google.com', // Using a wildcard for subdomains
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',  //https://api.dicebear.com/9.x/initials/svg?seed=anand%20maharana
      },
    ],
  },
};

export default nextConfig;
