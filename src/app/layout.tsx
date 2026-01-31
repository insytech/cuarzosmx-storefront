import { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "styles/globals.css"
import CookieConsentWrapper from "@modules/common/components/cookie-consent-wrapper"
import LazySpeedInsights from "@modules/common/components/lazy-speed-insights"

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-montserrat",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cuarzosmx.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CuarzosMX - Cristales, Cuarzos y Joyería Artesanal",
    template: "%s | CuarzosMX",
  },
  description:
    "Tienda en línea de cristales, cuarzos y joyería artesanal en México. Descubre piezas únicas de alta calidad: amatistas, cuarzo rosa, obsidiana y más. Envíos a todo México.",
  keywords: [
    "cuarzos",
    "cristales",
    "joyería artesanal",
    "amatista",
    "cuarzo rosa",
    "obsidiana",
    "piedras energéticas",
    "minerales",
    "joyería México",
    "cuarzos México",
    "tienda de cristales",
    "piedras naturales",
  ],
  authors: [{ name: "CuarzosMX" }],
  creator: "CuarzosMX",
  publisher: "CuarzosMX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.webp",
    apple: "/favicon.webp",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "CuarzosMX",
    title: "CuarzosMX - Cristales, Cuarzos y Joyería Artesanal",
    description:
      "Tienda en línea de cristales, cuarzos y joyería artesanal en México. Piezas únicas de alta calidad con envíos a todo el país.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CuarzosMX - Cristales y Joyería Artesanal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CuarzosMX - Cristales, Cuarzos y Joyería Artesanal",
    description:
      "Tienda en línea de cristales, cuarzos y joyería artesanal en México. Piezas únicas de alta calidad.",
    images: ["/og-image.jpg"],
    creator: "@cuarzosmx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Agregar cuando tengas las verificaciones
    // google: "tu-codigo-de-verificacion",
  },
  alternates: {
    canonical: siteUrl,
  },
}

// Schema.org JSON-LD para la organización
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CuarzosMX",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: "Tienda en línea de cristales, cuarzos y joyería artesanal en México.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "Spanish",
  },
  sameAs: [
    "https://www.facebook.com/cuarzosmx",
    "https://www.instagram.com/cuarzosmx",
  ],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CuarzosMX",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/store?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" data-mode="light" className={montserrat.variable}>
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <CookieConsentWrapper>
          <main className="relative">{props.children}</main>
        </CookieConsentWrapper>
        <LazySpeedInsights />
      </body>
    </html>
  )
}
