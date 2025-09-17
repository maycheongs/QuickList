import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Running in dev mode.')
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
