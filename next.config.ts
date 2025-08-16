import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'source.unsplash.com',
      'cloudflare-ipfs.com',
      'avatars.githubusercontent.com',
      'randomuser.me',
      'picsum.photos',
      'fastly.picsum.photos'
    ],
  },
};

export default nextConfig;
