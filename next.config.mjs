import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tentukan root project secara eksplisit (hindari warning multi-lockfile)
  outputFileTracingRoot: __dirname,
  eslint: {
    // Build tetap berjalan meskipun ada warning lint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
