import { htmlToPlainText, sanitizeHtml } from "./blog-seo"
import { processMarkdownImages } from "./blog-utils"

/**
 * Sanitized HTML of a category's SEO text (`metadata.seo_content`), for the
 * server render. Server-only: it pulls in `sanitize-html`.
 *
 * The admin saves HTML from the blog's rich editor; older values are plain
 * text (blank-line paragraphs, `## ` headings). Both go through the blog
 * sanitizer, which parses non-HTML as markdown, so legacy text keeps its
 * headings without a migration. Returns "" when there is nothing to show.
 */
export function renderSeoContent(content: unknown): string {
  if (typeof content !== "string" || !content.trim()) return ""
  return sanitizeHtml(processMarkdownImages(content))
}

/** Length of the visible text of sanitized SEO HTML (no tags, collapsed spaces). */
export function seoContentTextLength(html: string): number {
  return htmlToPlainText(html).length
}

/**
 * Character count above which the SEO block starts folded behind "Ver más".
 * About two short paragraphs: enough context for the reader without pushing
 * the footer far down on mobile.
 */
export const SEO_CONTENT_COLLAPSE_CHARS = 600

/**
 * Whether the SEO block should start folded, measured on the text without
 * tags (headings count). Folding is visual only: the full HTML is always in
 * the server HTML.
 */
export function shouldCollapseSeoContent(html: string): boolean {
  return seoContentTextLength(html) > SEO_CONTENT_COLLAPSE_CHARS
}
