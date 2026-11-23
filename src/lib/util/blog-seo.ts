import { marked } from "marked"
import sanitize from "sanitize-html"
import type { StoreBlogPost } from "./blog-api"
import { getImageUrl } from "./blog-utils"
import { SITE_URL, pageTitle } from "./seo"

/**
 * Configuracion del sanitizador del cuerpo de los posts. Antes era DOMPurify,
 * que sin DOM (en el servidor) no sanitiza nada; el post ahora se renderiza en
 * el servidor, asi que se usa `sanitize-html`, que funciona en Node.
 *
 * Vive aqui y no en `blog-utils.ts` a proposito: `blog-utils` lo importan
 * componentes cliente (`blog-card`) y metia `sanitize-html` (~345 KB) en el
 * bundle del navegador de `/blog`. Este modulo solo se usa en el servidor.
 *
 * Equivale a la config anterior: etiquetas de texto, `img`, `div` e `iframe`
 * (embeds de YouTube del editor) con los mismos atributos extra, y URLs solo
 * `http(s)` (o relativas). Nunca pasan `script`, `style`, atributos `on*` ni
 * `javascript:`. Los `iframe` solo pasan con un embed https de YouTube
 * (`YOUTUBE_EMBED_HOSTS`, ruta `/embed/...`); cualquier otro se quita entero.
 * `style` se permite (lo usa la alineacion `text-align` del editor).
 */
const YOUTUBE_EMBED_HOSTS = new Set(['www.youtube.com', 'www.youtube-nocookie.com'])

/** `src` de un embed de YouTube por https, sin usuario ni puerto. */
export function isYoutubeEmbedSrc(src: string | undefined): boolean {
    if (!src) return false
    let url: URL
    try {
        url = new URL(src)
    } catch {
        return false
    }
    return (
        url.protocol === 'https:' &&
        YOUTUBE_EMBED_HOSTS.has(url.hostname) &&
        !url.port && !url.username && !url.password &&
        url.pathname.startsWith('/embed/')
    )
}

const SANITIZE_OPTIONS: sanitize.IOptions = {
    allowedTags: [
        ...sanitize.defaults.allowedTags,
        'h1', 'h2', 'img', 'iframe', 'div', 'span', 'figure', 'figcaption',
        'u', 's', 'del', 'ins', 'mark', 'sub', 'sup',
    ],
    allowedAttributes: {
        '*': ['class', 'style', 'title', 'id', 'align', 'width', 'height', 'data-youtube-video'],
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height', 'loading'],
        iframe: ['src', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https'],
    allowedSchemesByTag: { iframe: ['https'] },
    allowedIframeHostnames: Array.from(YOUTUBE_EMBED_HOSTS),
    allowIframeRelativeUrls: false,
    allowProtocolRelative: false,
    // Quita el iframe completo (no solo su `src`) si no es un embed de YouTube.
    exclusiveFilter: (frame) =>
        frame.tag === 'iframe' && !isYoutubeEmbedSrc(frame.attribs.src),
    transformTags: {
        a: (tagName, attribs) => {
            if (attribs.target === '_blank') {
                return { tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }
            }
            return { tagName, attribs }
        },
    },
}

export const sanitizeHtml = (markdown: string): string => {
    // Check if the content is already HTML (contains HTML tags)
    const isHtml = /<[^>]*>/.test(markdown)

    let html: string
    if (isHtml) {
        // If it's already HTML, use it directly
        html = markdown
    } else {
        // If it's markdown, parse it
        html = marked.parse(markdown) as string
    }

    return sanitize(html, SANITIZE_OPTIONS).trim()
}

/** Largo maximo de una meta description generada desde el cuerpo. */
const DESCRIPTION_MAX = 160

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
}

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1].toLowerCase() === "x"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10)
      return Number.isFinite(n) ? String.fromCodePoint(n) : match
    }
    return ENTITIES[code.toLowerCase()] ?? match
  })
}

/**
 * Texto visible de un HTML: sin etiquetas ni el contenido de `script`,
 * `style` e `iframe`, con entidades decodificadas y espacios colapsados.
 */
export function htmlToPlainText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Texto plano de un cuerpo en markdown o HTML, recortado a 160 caracteres como
 * maximo en un limite de palabra (con "…" si se corto). Es el respaldo de la
 * meta description cuando el post no tiene `seo_description`.
 */
export function plainTextExcerpt(body: string, max = DESCRIPTION_MAX): string {
  const html = /<[^>]*>/.test(body) ? body : (marked.parse(body) as string)
  const text = htmlToPlainText(html)

  if (text.length <= max) return text

  const room = text.slice(0, max) // deja lugar para "…"
  const lastSpace = room.lastIndexOf(" ")
  const cut = (lastSpace > 0 ? room.slice(0, lastSpace) : room.slice(0, max - 1))
    .replace(/[\s,;:.\-–]+$/, "")
  return `${cut}…`
}

export type BlogPostSeo = {
  /** Para `metadata.title`; el template del layout agrega " | CuarzosMX". */
  title: string
  /** Para Open Graph y Twitter, que no usan el template: marca una sola vez. */
  socialTitle: string
  description: string
  /** URL absoluta y propia del post (no la home). */
  canonical: string
  /** Imagen del post como URL absoluta, o `null` si no tiene. */
  image: string | null
  /** Para `<meta name="keywords">`; `undefined` si el post no tiene. */
  keywords: string[] | undefined
}

/** `seo_keywords` separadas por comas, sin espacios ni entradas vacias. */
function parseKeywords(raw: string | null | undefined): string[] | undefined {
  const keywords = (raw ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
  return keywords.length > 0 ? keywords : undefined
}

/**
 * Valores SEO de un post del blog. `seo_title`, `seo_description` y
 * `seo_keywords` son los que captura el admin; si el titulo o la descripcion
 * estan vacios se usan el titulo y un extracto del cuerpo.
 */
export function blogPostSeo(post: StoreBlogPost, countryCode: string): BlogPostSeo {
  const title = pageTitle(post.seo_title, pageTitle(post.title))
  const description =
    post.seo_description?.replace(/\s+/g, " ").trim() ||
    plainTextExcerpt(post.body_markdown ?? "")

  return {
    title,
    socialTitle: `${title} | CuarzosMX`,
    description,
    canonical: `${SITE_URL}/${countryCode}/blog/${post.url_slug}`,
    image: getImageUrl(post.thumbnail_url ?? null),
    keywords: parseKeywords(post.seo_keywords),
  }
}
