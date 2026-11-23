// MIRROR — do not edit here first.
// Verbatim copy of the backend file `cuarzosmx/src/lib/editor-style-allowlist.ts`
// (single source of truth of the rich editor styles). The admin editor writes
// only these values and the storefront sanitizer (`blog-seo.ts`) allows only
// these values, so both files must stay in sync: change the backend file,
// then copy it here unchanged.

/**
 * Allowed text styles of the rich editor (blog body and category SEO text).
 *
 * Single source of truth: the admin pickers offer only these values, the admin
 * editor drops any other value when it loads HTML, and the storefront
 * sanitizer mirrors this file (anything outside it is removed there).
 *
 * Pure module: no imports from the admin, Tiptap or the DOM.
 *
 * HTML produced by the editor (canonical forms):
 * - text color:  <span style="color: #5A2D6B">
 * - font size:   <span style="font-size: 1.25rem">
 * - font family: <span style="font-family: 'Lora', serif">
 *   (one span combines them: style="color: #5A2D6B; font-family: 'Lora', serif; font-size: 1.25rem")
 * - highlight:   <mark data-color="#FEF3C7" style="background-color: #FEF3C7; color: inherit">
 * - notice:      <div data-callout="info|success|warning|error"> block content </div>
 * - button:      <p style="text-align: center"><a href="/mx/store" data-button="" style="display: ...">Text</a></p>
 *                (a link, never a form element; style built by `buildButtonStyle`)
 */

export interface PaletteColor {
    /** Canonical uppercase `#RRGGBB`. */
    value: string
    label: string
}

/** Text colors: the brand purples from the storefront Tailwind config, neutrals and status colors. */
export const TEXT_COLORS: readonly PaletteColor[] = [
    { value: "#5A2D6B", label: "Morado oscuro" }, // main-color-dark
    { value: "#9C72AF", label: "Morado" }, // main-color
    { value: "#111827", label: "Negro" }, // grey-90 (headings)
    { value: "#6B7280", label: "Gris" }, // grey-50
    { value: "#15803D", label: "Verde (éxito)" },
    { value: "#B45309", label: "Ámbar (advertencia)" },
    { value: "#B91C1C", label: "Rojo (error)" },
]

/** Soft background colors for the highlight. */
export const HIGHLIGHT_COLORS: readonly PaletteColor[] = [
    { value: "#E6D6F3", label: "Lila" }, // main-color-light
    { value: "#F8E3EA", label: "Rosa cuarzo" }, // quartz-pink
    { value: "#FEF3C7", label: "Amarillo" },
    { value: "#DCFCE7", label: "Verde" },
    { value: "#DBEAFE", label: "Azul" },
]

export type FontSizeKey = "small" | "normal" | "large" | "xlarge"

export interface FontSizeOption {
    key: FontSizeKey
    label: string
    /** `null` means no explicit size: the text keeps the size of its block. */
    value: string | null
}

export const FONT_SIZES: readonly FontSizeOption[] = [
    { key: "small", label: "Pequeño", value: "0.875rem" },
    { key: "normal", label: "Normal", value: null },
    { key: "large", label: "Grande", value: "1.25rem" },
    { key: "xlarge", label: "Muy grande", value: "1.5rem" },
]

export type FontSource = "site" | "google"

export interface FontFamilyOption {
    /** Family name, as written in CSS. */
    name: string
    /** Generic fallback family. */
    fallback: "serif" | "sans-serif" | "cursive"
    /**
     * `site`: already loaded by the storefront (Montserrat via next/font,
     * Simple Serenity Serif and Aqua Grotesque from /fonts).
     * `google`: loaded on demand from Google Fonts, only when a text uses it.
     */
    source: FontSource
    /** Canonical CSS value stored in the HTML: `'<name>', <fallback>`. */
    css: string
    /** Weights requested from Google Fonts. */
    weights: readonly number[]
}

const font = (name: string, fallback: FontFamilyOption["fallback"], source: FontSource): FontFamilyOption => ({
    name,
    fallback,
    source,
    css: `'${name}', ${fallback}`,
    weights: [400, 700],
})

/** Site fonts first, then Google Fonts with full Spanish (Latin) coverage. */
export const FONT_FAMILIES: readonly FontFamilyOption[] = [
    font("Montserrat", "sans-serif", "site"),
    font("Simple Serenity Serif", "serif", "site"),
    font("Aqua Grotesque", "sans-serif", "site"),
    font("Playfair Display", "serif", "google"),
    font("Lora", "serif", "google"),
    font("Merriweather", "serif", "google"),
    font("Cormorant Garamond", "serif", "google"),
    font("Poppins", "sans-serif", "google"),
    font("Lato", "sans-serif", "google"),
    font("Raleway", "sans-serif", "google"),
    font("Nunito", "sans-serif", "google"),
    font("Cinzel", "serif", "google"),
    font("Dancing Script", "cursive", "google"),
]

export const CALLOUT_TYPE_VALUES = ["info", "success", "warning", "error"] as const
export type CalloutType = (typeof CALLOUT_TYPE_VALUES)[number]

export interface CalloutTypeOption {
    value: CalloutType
    label: string
    /** Left border and label color. */
    accent: string
    /** Soft background. */
    background: string
}

export const CALLOUT_TYPES: readonly CalloutTypeOption[] = [
    { value: "info", label: "Información", accent: "#2563EB", background: "#EFF6FF" },
    { value: "success", label: "Éxito", accent: "#15803D", background: "#F0FDF4" },
    { value: "warning", label: "Advertencia", accent: "#B45309", background: "#FFFBEB" },
    { value: "error", label: "Error", accent: "#B91C1C", background: "#FEF2F2" },
]

export type ButtonAlignment = "left" | "center" | "right"

/** Alignment of the paragraph that holds the button (`text-align`). */
export const BUTTON_ALIGNMENTS: readonly { value: ButtonAlignment; label: string }[] = [
    { value: "left", label: "Izquierda" },
    { value: "center", label: "Centro" },
    { value: "right", label: "Derecha" },
]

export const isButtonAlignment = (value: unknown): value is ButtonAlignment =>
    BUTTON_ALIGNMENTS.some((a) => a.value === value)

export type ButtonRadius = "square" | "slight" | "rounded" | "pill"
export const BUTTON_RADII: readonly { value: ButtonRadius; label: string; css: string }[] = [
    { value: "square", label: "Cuadrado", css: "0" },
    { value: "slight", label: "Ligero", css: "4px" },
    { value: "rounded", label: "Redondeado", css: "12px" },
    { value: "pill", label: "Píldora", css: "9999px" },
]

export type ButtonSize = "small" | "medium" | "large"
export const BUTTON_SIZES: readonly { value: ButtonSize; label: string; padding: string; fontSize: string }[] = [
    { value: "small", label: "Pequeño", padding: "8px 16px", fontSize: "0.875rem" },
    { value: "medium", label: "Mediano", padding: "12px 24px", fontSize: "1rem" },
    { value: "large", label: "Grande", padding: "16px 32px", fontSize: "1.125rem" },
]

export type ButtonFontWeight = "normal" | "semibold" | "bold"
export const BUTTON_FONT_WEIGHTS: readonly { value: ButtonFontWeight; label: string; css: string }[] = [
    { value: "normal", label: "Normal", css: "400" },
    { value: "semibold", label: "Seminegrita", css: "600" },
    { value: "bold", label: "Negrita", css: "700" },
]

export const BUTTON_BORDER_WIDTHS = [0, 1, 2, 3, 4] as const
export type ButtonBorderWidth = (typeof BUTTON_BORDER_WIDTHS)[number]

/** Every look setting of a call-to-action button. */
export interface ButtonConfig {
    /** `#RRGGBB`, or null for no background (transparent). */
    background: string | null
    /** Text color `#RRGGBB`. */
    color: string
    /** `#RRGGBB`, or null for no border. */
    borderColor: string | null
    borderWidth: ButtonBorderWidth
    radius: ButtonRadius
    size: ButtonSize
    /** Canonical CSS value from FONT_FAMILIES, or null for the site font. */
    fontFamily: string | null
    fontWeight: ButtonFontWeight
    uppercase: boolean
    fullWidth: boolean
}

export const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
    background: "#5A2D6B",
    color: "#FFFFFF",
    borderColor: null,
    borderWidth: 0,
    radius: "rounded",
    size: "medium",
    fontFamily: null,
    fontWeight: "semibold",
    uppercase: false,
    fullWidth: false,
}

/** Starting points for the button dialog; every field stays editable. */
export const BUTTON_PRESETS: readonly { key: string; label: string; config: ButtonConfig }[] = [
    { key: "primary", label: "Principal", config: DEFAULT_BUTTON_CONFIG },
    { key: "secondary", label: "Secundario", config: { ...DEFAULT_BUTTON_CONFIG, background: "#9C72AF" } },
    {
        key: "outline",
        label: "Contorno",
        config: { ...DEFAULT_BUTTON_CONFIG, background: null, color: "#5A2D6B", borderColor: "#5A2D6B", borderWidth: 2 },
    },
]

/**
 * Inline style properties of `a[data-button]`, in the order the editor writes
 * them. The storefront allows exactly these on buttons (values validated with
 * `parseButtonStyle`).
 */
export const BUTTON_STYLE_PROPERTIES = [
    "display",
    "background-color",
    "color",
    "border",
    "border-radius",
    "padding",
    "font-size",
    "font-family",
    "font-weight",
    "text-transform",
    "text-align",
    "text-decoration",
] as const

/** `#rgb` or `#rrggbb` (any case). */
export const isValidHexColor = (value: unknown): value is string =>
    typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)

/** Hex color to uppercase `#RRGGBB`, or null if not a hex color. */
export function normalizeHexColor(value: string | null | undefined): string | null {
    const v = value?.trim()
    return isValidHexColor(v) ? canonicalHex(v) : null
}

const oneOf = <T extends string>(options: readonly { value: T }[], value: unknown, fallback: T): T =>
    options.some((o) => o.value === value) ? (value as T) : fallback

/** Every field validated; invalid values fall back to the defaults (or to none for colors). */
export function normalizeButtonConfig(input: Partial<ButtonConfig> | null | undefined): ButtonConfig {
    const c = input ?? {}
    const borderColor = normalizeHexColor(c.borderColor)
    const width = (BUTTON_BORDER_WIDTHS as readonly number[]).includes(c.borderWidth as number)
        ? (c.borderWidth as ButtonBorderWidth)
        : 0
    const hasBorder = borderColor !== null && width > 0
    return {
        background: normalizeHexColor(c.background),
        color: normalizeHexColor(c.color) ?? DEFAULT_BUTTON_CONFIG.color,
        borderColor: hasBorder ? borderColor : null,
        borderWidth: hasBorder ? width : 0,
        radius: oneOf(BUTTON_RADII, c.radius, DEFAULT_BUTTON_CONFIG.radius),
        size: oneOf(BUTTON_SIZES, c.size, DEFAULT_BUTTON_CONFIG.size),
        fontFamily: normalizeFontFamily(c.fontFamily),
        fontWeight: oneOf(BUTTON_FONT_WEIGHTS, c.fontWeight, DEFAULT_BUTTON_CONFIG.fontWeight),
        uppercase: c.uppercase === true,
        fullWidth: c.fullWidth === true,
    }
}

/** Canonical inline style of a button (see BUTTON_STYLE_PROPERTIES for the order). */
export function buildButtonStyle(input: Partial<ButtonConfig>): string {
    const c = normalizeButtonConfig(input)
    const size = BUTTON_SIZES.find((s) => s.value === c.size)!
    const parts: string[] = [
        `display: ${c.fullWidth ? "block" : "inline-block"}`,
        `background-color: ${c.background ?? "transparent"}`,
        `color: ${c.color}`,
        `border: ${c.borderColor ? `${c.borderWidth}px solid ${c.borderColor}` : "none"}`,
        `border-radius: ${BUTTON_RADII.find((r) => r.value === c.radius)!.css}`,
        `padding: ${size.padding}`,
        `font-size: ${size.fontSize}`,
    ]
    if (c.fontFamily) parts.push(`font-family: ${c.fontFamily}`)
    parts.push(
        `font-weight: ${BUTTON_FONT_WEIGHTS.find((w) => w.value === c.fontWeight)!.css}`,
        `text-transform: ${c.uppercase ? "uppercase" : "none"}`,
        "text-align: center",
        "text-decoration: none"
    )
    return parts.join("; ")
}

/** Read a button style back into a validated config (unknown properties are ignored). */
export function parseButtonStyle(style: string | null | undefined): ButtonConfig {
    const s = parseStyleDeclarations(style)
    const border = /^([0-4])px\s+solid\s+(#[0-9a-f]{3}(?:[0-9a-f]{3})?)$/i.exec(s.border ?? "")
    const weight = (s["font-weight"] ?? "").toLowerCase()
    return normalizeButtonConfig({
        background: s["background-color"],
        color: s.color,
        borderColor: border ? border[2] : null,
        borderWidth: border ? (Number(border[1]) as ButtonBorderWidth) : 0,
        radius: BUTTON_RADII.find((r) => r.css === s["border-radius"])?.value,
        size: (BUTTON_SIZES.find((z) => z.padding === s.padding) ?? BUTTON_SIZES.find((z) => z.fontSize === s["font-size"]))
            ?.value,
        fontFamily: s["font-family"],
        fontWeight:
            BUTTON_FONT_WEIGHTS.find((w) => w.css === weight)?.value ??
            (weight === "bold" ? "bold" : weight === "normal" ? "normal" : undefined),
        uppercase: (s["text-transform"] ?? "").toLowerCase() === "uppercase",
        fullWidth: (s.display ?? "").toLowerCase() === "block",
    })
}

export type ImageAlignment = "left" | "center" | "right"

/** Image figure alignment: left/right float with text beside it on desktop. */
export const IMAGE_ALIGNMENTS: readonly { value: ImageAlignment; label: string }[] = [
    { value: "left", label: "Izquierda" },
    { value: "center", label: "Centro" },
    { value: "right", label: "Derecha" },
]
export const isImageAlignment = (value: unknown): value is ImageAlignment =>
    IMAGE_ALIGNMENTS.some((a) => a.value === value)

/** Table inserted by the toolbar. */
export const TABLE_DEFAULTS = { rows: 3, cols: 3, withHeaderRow: true } as const

/** `data-*` attributes the editor writes, per tag (the storefront sanitizer allows exactly these). */
export const EDITOR_DATA_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
    a: ["data-button"],
    div: ["data-callout", "data-faq-answer", "data-youtube-video"],
    details: ["data-faq"],
    figure: ["data-align"],
    img: ["data-image-key"],
    mark: ["data-color"],
}

/**
 * Button link target: an internal path (`/mx/store`, not `//host`) or an
 * `https://` URL, without spaces or backslashes. Anything else is null.
 */
export function normalizeButtonHref(value: string | null | undefined): string | null {
    if (!value) return null
    const href = value.trim()
    if (/[\s\\]/.test(href)) return null
    if (/^\/(?!\/)/.test(href)) return href
    if (/^https:\/\/[^/?#]+/i.test(href)) return href
    return null
}
export const isAllowedButtonHref = (value: string | null | undefined) => normalizeButtonHref(value) !== null

/** Split an inline `style` attribute into `{ property: value }` (lowercase properties). */
export function parseStyleDeclarations(style: string | null | undefined): Record<string, string> {
    const out: Record<string, string> = {}
    if (!style) return out
    for (const declaration of style.split(";")) {
        const colon = declaration.indexOf(":")
        if (colon < 0) continue
        const property = declaration.slice(0, colon).trim().toLowerCase()
        const value = declaration.slice(colon + 1).trim()
        if (property && value) out[property] = value
    }
    return out
}

const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase()

/** `#rrggbb`, `#rgb` or `rgb(r, g, b)` to uppercase `#RRGGBB`; anything else to null. */
function canonicalHex(value: string | null | undefined): string | null {
    if (!value) return null
    const v = value.trim()
    let m = /^#([0-9a-f]{6})$/i.exec(v)
    if (m) return `#${m[1].toUpperCase()}`
    m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v)
    if (m) return `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`.toUpperCase()
    m = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(v)
    if (m) {
        const parts = [m[1], m[2], m[3]].map(Number)
        if (parts.some((p) => p > 255)) return null
        return `#${parts.map(toHex).join("")}`
    }
    return null
}

function inPalette(palette: readonly PaletteColor[], value: string | null | undefined): string | null {
    const hex = canonicalHex(value)
    return hex && palette.some((c) => c.value === hex) ? hex : null
}

/** Canonical text color if allowed, else null. */
export const normalizeColor = (value: string | null | undefined) => inPalette(TEXT_COLORS, value)
export const isAllowedColor = (value: string | null | undefined) => normalizeColor(value) !== null

/** Canonical highlight color if allowed, else null. */
export const normalizeHighlightColor = (value: string | null | undefined) => inPalette(HIGHLIGHT_COLORS, value)
export const isAllowedHighlightColor = (value: string | null | undefined) => normalizeHighlightColor(value) !== null

/** Canonical font size (`1.25rem`) if allowed, else null. "Normal" has no value. */
export function normalizeFontSize(value: string | null | undefined): string | null {
    if (!value) return null
    const v = value.trim().toLowerCase()
    return FONT_SIZES.some((s) => s.value === v) ? v : null
}
export const isAllowedFontSize = (value: string | null | undefined) => normalizeFontSize(value) !== null

/** The allowlisted font whose name is the first family of a CSS `font-family` value. */
export function findFontFamily(value: string | null | undefined): FontFamilyOption | null {
    if (!value) return null
    const first = value.split(",")[0].trim().replace(/^['"]|['"]$/g, "").trim().toLowerCase()
    if (!first) return null
    return FONT_FAMILIES.find((f) => f.name.toLowerCase() === first) ?? null
}

/** Canonical CSS value (`'Lora', serif`) if the first family is allowed, else null. */
export const normalizeFontFamily = (value: string | null | undefined) => findFontFamily(value)?.css ?? null
export const isAllowedFontFamily = (value: string | null | undefined) => normalizeFontFamily(value) !== null

export const isCalloutType = (value: unknown): value is CalloutType =>
    typeof value === "string" && (CALLOUT_TYPE_VALUES as readonly string[]).includes(value)

/**
 * Google Fonts stylesheet URL for the allowlisted Google fonts among `families`
 * (names or CSS values), each once, in first-seen order. Null when none.
 */
export function googleFontsCssHref(families: readonly string[]): string | null {
    const seen: FontFamilyOption[] = []
    for (const family of families) {
        const f = findFontFamily(family)
        if (f && f.source === "google" && !seen.includes(f)) seen.push(f)
    }
    if (!seen.length) return null
    const params = seen.map((f) => `family=${f.name.replace(/ /g, "+")}:wght@${f.weights.join(";")}`)
    return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`
}
