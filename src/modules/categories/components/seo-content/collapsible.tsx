"use client"

import { useId, useState } from "react"

/**
 * Folds long SEO text behind "Ver más". The children are rendered on the
 * server and stay in the DOM while folded (only clipped with CSS), so search
 * engines index the full text.
 */
export default function SeoContentCollapsible({
  collapsible,
  children,
}: {
  collapsible: boolean
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const contentId = useId()

  if (!collapsible) return <>{children}</>

  const folded = !expanded

  return (
    <>
      {/* The fade is a CSS mask, so it works on any page background. */}
      <div
        id={contentId}
        className={
          folded
            ? "max-h-72 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
            : undefined
        }
      >
        {children}
      </div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((value) => !value)}
        className="mt-4 text-sm font-semibold text-main-color-dark hover:text-main-color underline underline-offset-4"
        data-testid="category-seo-content-toggle"
      >
        {expanded ? "Ver menos" : "Ver más"}
      </button>
    </>
  )
}
