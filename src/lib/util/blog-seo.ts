import { marked } from "marked"
import sanitize from "sanitize-html"
import type { StoreBlogPost } from "./blog-api"
import { getImageUrl } from "./blog-utils"
import {
    BUTTON_FONT_WEIGHTS,
    BUTTON_RADII,
    BUTTON_SIZES,
    BUTTON_STYLE_PROPERTIES,
    CALLOUT_TYPE_VALUES,
    FONT_FAMILIES,
    FONT_SIZES,
    HIGHLIGHT_COLORS,
    IMAGE_ALIGNMENTS,
    TEXT_COLORS,
    buildButtonStyle,
    findFontFamily,
    normalizeButtonHref,
    normalizeColor,
    normalizeFontSize,
    normalizeHighlightColor,
    parseButtonStyle,
    parseStyleDeclarations,
    type FontFamilyOption,
} from "./editor-style-allowlist"
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
 * `style` solo pasa con las propiedades y valores de `ALLOWED_STYLES` (abajo).
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

/**
 * Estilos del editor enriquecido (S5). Los valores permitidos salen de
 * `editor-style-allowlist.ts` (copia del archivo del backend):
 * - `span`: `color` (paleta), `font-size` (3 tamaños), `font-family` (lista),
 *   `background-color` (paleta de resaltado).
 * - `mark` (resaltado): `background-color` (paleta) y `color` (paleta o `inherit`).
 * - `p`, `h1`–`h6`: `text-align` left|center|right|justify (lo unico que usan
 *   los 34 posts publicados al 2026-11-23, en p/h1–h4).
 * - `table`, `col`: `min-width` en px (lo escribe la tabla de Tiptap).
 * - `a[data-button]`: solo `BUTTON_STYLE_PROPERTIES`, reconstruidas con
 *   `parseButtonStyle` + `buildButtonStyle`; un `a` sin `data-button` pierde
 *   su `style`.
 * Cualquier otra propiedad, valor o etiqueta con `style` se quita (`'*': {}`:
 * sin esa entrada, sanitize-html dejaria pasar todo en las etiquetas sin regla).
 */
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const oneOf = (values: readonly string[]): RegExp[] => [
    new RegExp(`^(?:${values.map(escapeRegExp).join("|")})$`, "i"),
]
const HEX = /^#[0-9a-f]{6}$/i

/** Montserrat la carga next/font con un nombre interno: se apunta a su variable. */
const MONTSERRAT_CSS = "var(--font-montserrat), 'Montserrat', sans-serif"
const fontFamilyCss = (font: FontFamilyOption) =>
    font.name === "Montserrat" ? MONTSERRAT_CSS : font.css

const FONT_FAMILY_VALUES = FONT_FAMILIES.map(fontFamilyCss)
const TEXT_COLOR_VALUES = TEXT_COLORS.map((c) => c.value)
const HIGHLIGHT_COLOR_VALUES = HIGHLIGHT_COLORS.map((c) => c.value)
const FONT_SIZE_VALUES = FONT_SIZES.flatMap((s) => (s.value ? [s.value] : []))
const TEXT_ALIGN = { "text-align": oneOf(["left", "center", "right", "justify"]) }
const TABLE_MIN_WIDTH = { "min-width": [/^\d{1,4}px$/] }

const BUTTON_STYLES: Record<(typeof BUTTON_STYLE_PROPERTIES)[number], RegExp[]> = {
    display: oneOf(["inline-block", "block"]),
    "background-color": [HEX, /^transparent$/i],
    color: [HEX],
    border: [/^none$/i, /^[0-4]px solid #[0-9a-f]{6}$/i],
    "border-radius": oneOf(BUTTON_RADII.map((r) => r.css)),
    padding: oneOf(BUTTON_SIZES.map((s) => s.padding)),
    "font-size": oneOf(BUTTON_SIZES.map((s) => s.fontSize)),
    "font-family": oneOf(FONT_FAMILY_VALUES),
    "font-weight": oneOf(BUTTON_FONT_WEIGHTS.map((w) => w.css)),
    "text-transform": oneOf(["none", "uppercase"]),
    "text-align": oneOf(["center"]),
    "text-decoration": oneOf(["none"]),
}

const ALLOWED_STYLES: sanitize.IOptions["allowedStyles"] = {
    "*": {},
    span: {
        color: oneOf(TEXT_COLOR_VALUES),
        "background-color": oneOf(HIGHLIGHT_COLOR_VALUES),
        "font-size": oneOf(FONT_SIZE_VALUES),
        "font-family": oneOf(FONT_FAMILY_VALUES),
    },
    mark: {
        "background-color": oneOf(HIGHLIGHT_COLOR_VALUES),
        color: oneOf([...TEXT_COLOR_VALUES, "inherit"]),
    },
    p: TEXT_ALIGN,
    h1: TEXT_ALIGN,
    h2: TEXT_ALIGN,
    h3: TEXT_ALIGN,
    h4: TEXT_ALIGN,
    h5: TEXT_ALIGN,
    h6: TEXT_ALIGN,
    table: TABLE_MIN_WIDTH,
    col: TABLE_MIN_WIDTH,
    a: BUTTON_STYLES,
}

/**
 * Cambia cada `font-family` por su forma canonica de la lista (Montserrat a
 * su variable de next/font) y quita las que no estan en la lista.
 */
function normalizeFontFamilies(style: string | undefined): string | undefined {
    if (!style || !/font-family/i.test(style)) return style
    return style
        .split(";")
        .flatMap((declaration) => {
            const colon = declaration.indexOf(":")
            if (colon < 0 || declaration.slice(0, colon).trim().toLowerCase() !== "font-family") {
                return [declaration]
            }
            const font = findFontFamily(declaration.slice(colon + 1))
            return font ? [`font-family: ${fontFamilyCss(font)}`] : []
        })
        .join(";")
}

/**
 * Estilo de `span` y `mark` en forma canonica. El navegador guarda el HTML del
 * editor normalizado por el CSSOM (`rgb(90, 45, 107)`, `rgba(..., 1)`, fuentes
 * sin comillas o con comillas dobles, `;` al final): cada valor permitido se
 * pasa a la forma de la lista (`#5A2D6B`, `'Lora', serif`) y los que no estan
 * en la lista se quitan. Las demas propiedades quedan como estan y las quita
 * `ALLOWED_STYLES`.
 */
const TEXT_STYLE_NORMALIZERS: Record<"span" | "mark", Record<string, (value: string) => string | null>> = {
    span: {
        color: normalizeColor,
        "background-color": normalizeHighlightColor,
        "font-size": normalizeFontSize,
        "font-family": (value) => findFontFamily(value)?.css ?? null,
    },
    mark: {
        "background-color": normalizeHighlightColor,
        color: (value) => (value.trim().toLowerCase() === "inherit" ? "inherit" : normalizeColor(value)),
    },
}

function normalizeTextStyle(tagName: string, style: string | undefined): string | undefined {
    const normalizers = TEXT_STYLE_NORMALIZERS[tagName as keyof typeof TEXT_STYLE_NORMALIZERS]
    if (!normalizers || !style) return style
    const declarations = Object.entries(parseStyleDeclarations(style)).flatMap(([property, value]) => {
        const normalize = normalizers[property]
        if (!normalize) return [`${property}: ${value}`]
        const canonical = normalize(value)
        return canonical ? [`${property}: ${canonical}`] : []
    })
    return declarations.length ? declarations.join("; ") : undefined
}

/** Atributo `data-*` con su lista de valores; `""` = atributo sin valor. */
const DATA_ATTRIBUTE_VALUES: Record<string, Record<string, readonly string[]>> = {
    a: { "data-button": [""] },
    div: {
        "data-callout": CALLOUT_TYPE_VALUES,
        "data-faq-answer": [""],
        "data-youtube-video": [""],
    },
    details: { "data-faq": [""] },
    figure: { "data-align": IMAGE_ALIGNMENTS.map((a) => a.value) },
    mark: { "data-color": HIGHLIGHT_COLOR_VALUES },
}
const SPAN_ATTRIBUTE = /^[1-9]\d{0,2}$/

/**
 * Valida los atributos de la etiqueta antes del filtro de sanitize-html
 * (que no sabe de valores por atributo): `data-*` con valor fuera de su
 * lista, `colspan`/`rowspan` no numericos y `href` de botones que no son una
 * ruta interna o https se quitan; el estilo de los botones se reconstruye.
 */
function transformEditorTag(tagName: string, attribs: sanitize.Attributes) {
    const out: sanitize.Attributes = { ...attribs }
    const allowedData = DATA_ATTRIBUTE_VALUES[tagName] ?? {}
    for (const name of Object.keys(out)) {
        if (name.startsWith("data-") && name !== "data-image-key") {
            const values = allowedData[name]
            // Marcadores sin valor (`data-faq`): cualquier valor queda en "".
            if (values?.length === 1 && values[0] === "") out[name] = ""
            else if (!values?.includes(out[name])) delete out[name]
        }
        if ((name === "colspan" || name === "rowspan") && !SPAN_ATTRIBUTE.test(out[name] ?? "")) {
            delete out[name]
        }
    }

    if (tagName === "a") {
        if ("data-button" in out) {
            out.style = buildButtonStyle(parseButtonStyle(out.style))
            const href = normalizeButtonHref(out.href)
            if (href) out.href = href
            else delete out.href
        } else {
            delete out.style
        }
        if (out.target === "_blank") out.rel = "noopener noreferrer"
    }

    const style = normalizeFontFamilies(normalizeTextStyle(tagName, out.style))
    if (style === undefined) delete out.style
    else out.style = style

    return { tagName, attribs: out }
}

// `allowedEmptyAttributes` existe en sanitize-html 2.x pero falta en sus tipos:
// sin el, `data-faq=""` saldria como atributo booleano `data-faq`.
const SANITIZE_OPTIONS: sanitize.IOptions & { allowedEmptyAttributes: string[] } = {
    allowedTags: [
        ...sanitize.defaults.allowedTags,
        'h1', 'h2', 'img', 'iframe', 'div', 'span', 'figure', 'figcaption',
        'u', 's', 'del', 'ins', 'mark', 'sub', 'sup',
        'details', 'summary',
        'table', 'colgroup', 'col', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
        '*': ['class', 'style', 'title', 'id', 'align', 'width', 'height'],
        a: ['href', 'name', 'target', 'rel', 'data-button'],
        img: ['src', 'alt', 'width', 'height', 'loading', 'data-image-key'],
        iframe: ['src', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height'],
        div: ['data-callout', 'data-faq-answer', 'data-youtube-video'],
        details: ['data-faq'],
        figure: ['data-align'],
        mark: ['data-color'],
        th: ['colspan', 'rowspan'],
        td: ['colspan', 'rowspan'],
    },
    allowedEmptyAttributes: ['alt', 'data-button', 'data-faq', 'data-faq-answer', 'data-youtube-video'],
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ['http', 'https'],
    allowedSchemesByTag: { iframe: ['https'] },
    allowedIframeHostnames: Array.from(YOUTUBE_EMBED_HOSTS),
    allowIframeRelativeUrls: false,
    allowProtocolRelative: false,
    // Quita el iframe completo (no solo su `src`) si no es un embed de YouTube.
    exclusiveFilter: (frame) =>
        frame.tag === 'iframe' && !isYoutubeEmbedSrc(frame.attribs.src),
    // `target="_blank"` siempre con `rel="noopener noreferrer"` (en `transformEditorTag`).
    transformTags: { '*': transformEditorTag },
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
