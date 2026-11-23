import { findFontFamily, googleFontsCssHref } from "./editor-style-allowlist"

/**
 * On-demand Google Fonts for rich editor HTML (blog body, category SEO text).
 *
 * Reads the `font-family` declarations of the inline `style` attributes only
 * (never the text) and keeps the allowlisted Google fonts. Site fonts
 * (Montserrat, Simple Serenity Serif, Aqua Grotesque) are already loaded.
 * The URL is built by the allowlist from its own font names, so a name outside
 * the allowlist can never reach it.
 */

const STYLE_ATTRIBUTE = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi

const decodeQuotes = (value: string) =>
  value
    .replace(/&#0*39;|&#x0*27;|&apos;/gi, "'")
    .replace(/&quot;|&#0*34;|&#x0*22;/gi, '"')
    .replace(/&amp;/gi, "&")

/** `font-family` values found in the inline styles of `html`. */
function fontFamilyValues(html: string): string[] {
  const values: string[] = []
  const pattern = new RegExp(STYLE_ATTRIBUTE.source, STYLE_ATTRIBUTE.flags)
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) !== null) {
    const style = decodeQuotes(match[1] ?? match[2] ?? "")
    for (const declaration of style.split(";")) {
      const colon = declaration.indexOf(":")
      if (colon < 0) continue
      if (declaration.slice(0, colon).trim().toLowerCase() !== "font-family") continue
      values.push(declaration.slice(colon + 1).trim())
    }
  }
  return values
}

/** Allowlisted Google font names used by `html`, each once, in first-seen order. */
export function editorFontsUsed(html: string): string[] {
  const names: string[] = []
  for (const value of fontFamilyValues(html)) {
    const font = findFontFamily(value)
    if (font?.source === "google" && !names.includes(font.name)) names.push(font.name)
  }
  return names
}

/** One Google Fonts stylesheet URL (`display=swap`) for `html`, or null if it needs none. */
export function editorFontsHref(html: string): string | null {
  return googleFontsCssHref(editorFontsUsed(html))
}
