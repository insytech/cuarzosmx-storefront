import { marked } from "marked"
import sanitize from "sanitize-html"
import type { BlogPost } from "../../types/global"
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
 * `javascript:`; los `iframe` solo con `src` https.
 */
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
    allowProtocolRelative: false,
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
 * Texto plano de un cuerpo en markdown o HTML, recortado a 160 caracteres como
 * maximo en un limite de palabra (con "…" si se corto). Es el respaldo de la
 * meta description cuando el post no tiene `seo_description`.
 */
export function plainTextExcerpt(body: string, max = DESCRIPTION_MAX): string {
  const html = /<[^>]*>/.test(body) ? body : (marked.parse(body) as string)
  const text = decodeEntities(
    html
      .replace(/<(script|style|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim()

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
}

/**
 * Valores SEO de un post del blog. `seo_title` y `seo_description` son los que
 * captura el admin; si estan vacios se usan el titulo y un extracto del cuerpo.
 */
export function blogPostSeo(post: BlogPost, countryCode: string): BlogPostSeo {
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
  }
}
