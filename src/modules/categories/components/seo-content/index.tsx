import {
  parseSeoContent,
  shouldCollapseSeoContent,
} from "@lib/util/seo-content"
import SeoContentCollapsible from "./collapsible"

/**
 * Editable SEO text shown below a category's products (`metadata.seo_content`).
 * Server component: the text is in the initial HTML so crawlers see it. Blocks
 * are rendered as React text nodes, so any HTML typed in the admin is escaped.
 * Long text starts folded behind "Leer más"; folding is visual only.
 */
export default function CategorySeoContent({
  content,
  categoryName,
}: {
  content: unknown
  categoryName: string
}) {
  const blocks = parseSeoContent(typeof content === "string" ? content : null)
  if (!blocks.length) return null

  return (
    <section
      aria-label={`Información sobre ${categoryName}`}
      className="mt-12 md:mt-16 mb-8 md:mb-12 pt-8 md:pt-10 border-t border-gray-200"
      data-testid="category-seo-content"
    >
      {/* Full-width divider ends the products area; the reading column is
          centered on the page, with left-aligned text for readability. */}
      <div className="max-w-3xl mx-auto">
        <SeoContentCollapsible collapsible={shouldCollapseSeoContent(blocks)}>
          {blocks.map((block, i) =>
            block.type === "h2" ? (
              <h2
                key={i}
                className="text-xl md:text-2xl font-semibold text-main-color-dark mt-8 first:mt-0 mb-3"
              >
                {block.text}
              </h2>
            ) : (
              <p
                key={i}
                className="text-gray-700 leading-relaxed mb-4 last:mb-0"
              >
                {block.text}
              </p>
            )
          )}
        </SeoContentCollapsible>
      </div>
    </section>
  )
}
