export type SeoContentBlock = { type: "h2" | "p"; text: string }

/**
 * Parses the plain-text SEO content typed in the admin (category
 * `metadata.seo_content`) into blocks.
 *
 * Format:
 * - One or more blank lines (whitespace-only lines count, CRLF is accepted)
 *   separate paragraphs.
 * - Single newlines inside a paragraph are joined with a space, so text
 *   pasted with hard wraps still reads as one paragraph.
 * - A line starting with `## ` is an `h2`, even when it is not followed by a
 *   blank line; it also ends the paragraph before it. `##` with no text is
 *   ignored, and `##text` (no space) stays plain text.
 *
 * The output is plain text only: render it as React text nodes, never as
 * HTML, so anything HTML-like is shown literally and escaped.
 */
export function parseSeoContent(text: string | null | undefined): SeoContentBlock[] {
  if (!text) return []

  const blocks: SeoContentBlock[] = []
  let paragraph: string[] = []

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") })
    paragraph = []
  }

  for (const rawLine of text.split(/\r?\n|\r/)) {
    const line = rawLine.trim()
    if (!line) {
      flush()
      continue
    }
    if (line === "##" || line.startsWith("## ")) {
      flush()
      const heading = line.slice(2).trim()
      if (heading) blocks.push({ type: "h2", text: heading })
      continue
    }
    paragraph.push(line)
  }
  flush()

  return blocks
}
