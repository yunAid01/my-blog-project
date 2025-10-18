import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ▼▼▼ 이 부분을 추가하세요 ▼▼▼
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // ▲▲▲ 여기까지 추가 ▲▲▲
};

export default nextConfig;
