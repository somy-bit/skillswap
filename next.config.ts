import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    {
      protocol:'https',
      hostname:'images.unsplash.com',
      pathname :'/**'
    },
    {
      protocol:'https',
      hostname:'storage.googleapis.com',
      pathname:"/**",
    }
    ],
  },

};

export default nextConfig;
