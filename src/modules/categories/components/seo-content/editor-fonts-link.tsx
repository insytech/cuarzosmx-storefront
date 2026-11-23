import { editorFontsHref } from "@lib/util/editor-fonts"

/**
 * Google Fonts stylesheet for the allowlisted fonts that a sanitized editor
 * HTML uses (S5d), rendered on the server. Nothing when the text only uses
 * site fonts. Shared by the category SEO block and the blog post body.
 */
export default function EditorFontsLink({ html }: { html: string }) {
  const href = editorFontsHref(html)
  if (!href) return null
  return <link rel="stylesheet" href={href} data-testid="editor-fonts" />
}
