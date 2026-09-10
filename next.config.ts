import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828],
    imageSizes: [64, 96, 110, 128, 220, 256],
  },
};

export default nextConfig;
