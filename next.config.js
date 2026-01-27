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
  // Optimización de imágenes DESACTIVADA temporalmente
  // Razón: Límite de 5,000 transformaciones gratuitas de Vercel alcanzado
  // Las imágenes se sirven directamente desde R2 (Cloudflare CDN)
  // TODO: Re-activar después de pre-optimizar imágenes en R2
  images: {
    unoptimized: true,  // Desactiva transformaciones de Vercel
    // Configuración anterior (comentada para referencia):
    // formats: ["image/webp"],
    // deviceSizes: [640, 828, 1200, 1920],
    // imageSizes: [64, 128, 256],
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
  // Rewrites para proxy
  async rewrites() {
    const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL
    const rewrites = []

    // Proxy del Admin Panel de Medusa y sus APIs
    // Permite que el admin funcione desde cuarzos.mx/app
    if (MEDUSA_BACKEND_URL) {
      const backendBase = MEDUSA_BACKEND_URL.replace(/\/$/, "")

      // Admin dashboard UI
      rewrites.push({
        source: "/app/:path*",
        destination: `${backendBase}/app/:path*`,
      })

      // Admin authentication API
      rewrites.push({
        source: "/auth/:path*",
        destination: `${backendBase}/auth/:path*`,
      })

      // Admin API endpoints
      rewrites.push({
        source: "/admin/:path*",
        destination: `${backendBase}/admin/:path*`,
      })
    }

    // Proxy de medios legados de WordPress
    if (LEGACY_MEDIA_ORIGIN) {
      const legacyBase = LEGACY_MEDIA_ORIGIN.replace(/\/$/, "")
      rewrites.push({
        source: "/wp-content/:path*",
        destination: `${legacyBase}/wp-content/:path*`,
      })
    }

    return rewrites
  },
  // Redirects para links externos (mejora deliverability de emails)
  async redirects() {
    return [
      {
        source: "/whatsapp",
        destination: "https://wa.me/528120888937",
        permanent: true,
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
