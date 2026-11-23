import {
  renderSeoContent,
  shouldCollapseSeoContent,
} from "@lib/util/seo-content"
import SeoContentCollapsible from "./collapsible"
import EditorFontsLink from "./editor-fonts-link"

/**
 * Typography of the SEO HTML, taken from the blog body (`blog-content.tsx`)
 * at a smaller scale, with the h2 look this block already had. Tiptap's
 * `text-align` comes as inline style; the YouTube embed is made responsive
 * 16:9 by `[data-youtube-video]` in `globals.css`, here only full width.
 * `editor-content` styles the editor blocks (notices, FAQ, tables, aligned
 * figures, buttons) from `styles/editor-content.css`, like the blog body.
 */
const CONTENT_CLASSES = [
  "editor-content prose max-w-none",
  // Same heading font as the blog body and the admin editor, so what the
  // admin shows is what the category page shows. A font picked in the editor
  // (inline span) still overrides it.
  "prose-headings:font-serenity",
  "prose-h1:text-2xl prose-h1:md:text-3xl prose-h1:font-bold prose-h1:text-gray-900 prose-h1:mt-8 prose-h1:mb-4 [&>h1:first-child]:mt-0",
  "prose-h2:text-xl prose-h2:md:text-2xl prose-h2:font-semibold prose-h2:text-main-color-dark prose-h2:mt-8 prose-h2:mb-3 [&>h2:first-child]:mt-0",
  "prose-h3:text-lg prose-h3:md:text-xl prose-h3:font-semibold prose-h3:text-gray-800 prose-h3:mt-6 prose-h3:mb-3",
  "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mt-0 prose-p:mb-4",
  "prose-a:text-main-color prose-a:no-underline hover:prose-a:underline hover:prose-a:text-main-color-dark",
  "prose-strong:text-gray-900 prose-strong:font-semibold",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4",
  "[&_li]:mb-2 [&_li]:text-gray-700 [&_li>p]:my-0 [&_li::marker]:text-main-color",
  "[&_img]:w-full [&_img]:h-auto [&_img]:max-h-[500px] [&_img]:object-cover [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-8",
  "[&_[data-youtube-video]]:my-8 [&_iframe]:w-full [&_iframe]:rounded-xl [&_iframe]:shadow-md",
  "[&>*:last-child]:mb-0",
].join(" ")

/**
 * Editable SEO text shown below a category's products (`metadata.seo_content`).
 * Server component: the sanitized HTML is in the initial HTML so crawlers see
 * it (legacy plain text is rendered as markdown). Long text starts folded
 * behind "Ver más"; folding is visual only.
 */
export default function CategorySeoContent({
  content,
  categoryName,
}: {
  content: unknown
  categoryName: string
}) {
  const html = renderSeoContent(content)
  if (!html) return null

  return (
    <section
      aria-label={`Información sobre ${categoryName}`}
      className="mt-12 md:mt-16 mb-8 md:mb-12 pt-8 md:pt-10 border-t border-gray-200"
      data-testid="category-seo-content"
    >
      {/* Full-width divider ends the products area; the reading column is
          centered on the page, with left-aligned text for readability. */}
      <EditorFontsLink html={html} />
      <div className="max-w-3xl mx-auto">
        <SeoContentCollapsible collapsible={shouldCollapseSeoContent(html)}>
          <div
            className={CONTENT_CLASSES}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </SeoContentCollapsible>
      </div>
    </section>
  )
}
