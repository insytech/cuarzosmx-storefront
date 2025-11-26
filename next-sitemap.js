const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cuarzosmx.com"

const excludedPaths = [
  "/checkout",
  "/checkout/*",
  "/account",
  "/account/*",
  "/cart",
  "/order/*",
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: excludedPaths,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    additionalSitemaps: [
      `${siteUrl}/sitemap.xml`,
    ],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: excludedPaths,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: excludedPaths,
      },
    ],
  },
  transform: async (config, path) => {
    // Prioridades personalizadas por tipo de página
    let priority = config.priority
    let changefreq = config.changefreq

    if (path === "/" || path === "/mx") {
      priority = 1.0
      changefreq = "daily"
    } else if (path.includes("/products/")) {
      priority = 0.9
      changefreq = "weekly"
    } else if (path.includes("/categories/") || path.includes("/collections/")) {
      priority = 0.8
      changefreq = "weekly"
    } else if (path.includes("/blog/")) {
      priority = 0.7
      changefreq = "weekly"
    } else if (path === "/store" || path.includes("/store")) {
      priority = 0.8
      changefreq = "daily"
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
