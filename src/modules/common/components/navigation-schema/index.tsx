const NavigationSchema = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cuarzosmx.com"
  const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "mx"

  const navItems = [
    { name: "Inicio", url: `/${countryCode}` },
    { name: "Tienda", url: `/${countryCode}/store` },
    { name: "Acerca de Nosotros", url: `/${countryCode}/about` },
    { name: "Blog", url: `/${countryCode}/blog` },
    { name: "Contacto", url: `/${countryCode}/contact` },
    { name: "Preguntas Frecuentes", url: `/${countryCode}/faq` },
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Menú Principal",
    url: siteUrl,
    hasPart: navItems.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: `${siteUrl}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default NavigationSchema
