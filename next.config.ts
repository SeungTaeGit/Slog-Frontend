import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/seungtae',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
