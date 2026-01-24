const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

// Origen de medios legado (p. ej., https://media.cuarzos.mx o https://legacy.cuarzos.mx)
const LEGACY_MEDIA_ORIGIN = process.env.LEGACY_MEDIA_ORIGIN

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimizaciones de rendimiento
  poweredByHeader: false,
  compress: true,
  // Optimización de imágenes (optimizado para reducir transformaciones de Vercel)
  // - Solo webp (avif es más lento de generar y duplica variantes)
  // - deviceSizes reducido de 7 a 4 breakpoints clave
  // - imageSizes reducido de 8 a 3 para íconos/thumbnails pequeños
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 128, 256],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      // Cloudflare R2 storage
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // WordPress legacy media from previous site
      {
        protocol: "https",
        hostname: "cuarzos.mx",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "www.cuarzos.mx",
        pathname: "/wp-content/**",
      },
      // Host legado configurable para servir /wp-content/ tras la migración
      ...(LEGACY_MEDIA_ORIGIN
        ? (() => {
          try {
            const u = new URL(LEGACY_MEDIA_ORIGIN)
            return [
              {
                protocol: u.protocol.replace(":", ""),
                hostname: u.hostname,
                pathname: "/wp-content/**",
              },
            ]
          } catch {
            return []
          }
        })()
        : []),
    ],
  },
  // Rewrites para proxy de medios legados
  async rewrites() {
    if (!LEGACY_MEDIA_ORIGIN) return []
    const base = LEGACY_MEDIA_ORIGIN.replace(/\/$/, "")
    return [
      {
        source: "/wp-content/:path*",
        destination: `${base}/wp-content/:path*`,
      },
    ]
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
