import type { Metadata } from "next"

/**
 * Helpers de metadatos sociales.
 *
 * En Next.js los objetos `openGraph` y `twitter` de una pagina REEMPLAZAN por
 * completo a los del layout, no se fusionan. Ocho paginas declaraban su propio
 * `openGraph` sin `images` y con eso borraban la imagen de marca del layout
 * raiz: `/mx`, `/mx/store` y las categorias se compartian sin `og:image`.
 * Usa estos helpers en lugar de repetir el literal en cada pagina.
 */

/**
 * URL publica del sitio. FUENTE UNICA: antes este literal estaba repetido en seis
 * archivos (layout raiz, sitemap y los cuatro componentes de JSON-LD), y el
 * respaldo apuntaba al apice cuando el host canonico ya era `www` — si alguien
 * quitara la variable, el sitio volveria a emitir canonical al host equivocado en
 * silencio. Es la misma clase de fallo que el `metadataBase` que apuntaba al
 * backend.
 *
 * Debe coincidir con el dominio Production de Vercel.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuarzos.mx"

/** Imagen social de marca. Vive en `public/og-image.jpg` (1200x630). */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "CuarzosMX - Cristales y Joyería Artesanal",
} as const

type SocialInput = {
  title: string
  description: string
  /**
   * Ruta canonica relativa (p.ej. "/store"). Se resuelve contra el
   * `metadataBase` del layout raiz y emite `og:url`, la senal canonica que
   * usan WhatsApp y Facebook. Debe coincidir con `alternates.canonical`.
   */
  path?: string
}

/** `openGraph` de una pagina, con la imagen de marca ya incluida. */
export function buildOpenGraph({
  title,
  description,
  path,
}: SocialInput): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "es_MX",
    siteName: "CuarzosMX",
    title,
    description,
    ...(path ? { url: path } : {}),
    images: [OG_IMAGE],
  }
}

/** `twitter` de una pagina, con la imagen de marca ya incluida. */
export function buildTwitter({
  title,
  description,
}: Omit<SocialInput, "path">): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE.url],
  }
}
