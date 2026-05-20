import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image Optimization ─────────────────────────────────────────────────────
  images: {
    // Serve modern formats first: avif > webp > original
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 7 days on the CDN / edge
    minimumCacheTTL: 604800,
    // Devices widths for srcset breakpoints
    deviceSizes: [640, 750, 828, 1080, 1280, 1920],
    // Allowed remote image patterns (add GitHub avatars for project cards)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  // ── React Compiler (Next 15 canary) / SWC options ──────────────────────────
  compiler: {
    // Remove console.log in production builds only
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ── Performance Headers ────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Tell browsers to cache immutable static assets aggressively
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          // Reduce referrer leakage
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Clickjacking protection
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
  // Disable X-Powered-By header (minor security improvement)
  poweredByHeader: false,

  // Enable gzip + brotli compression at the Next.js layer
  compress: true,

  // Strict mode catches accidental double-renders in dev
  reactStrictMode: true,
};

export default nextConfig;
