import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <>
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-main-color to-main-color-dark py-12 md:py-16">
        <div className="content-container max-w-7xl mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <LocalizedClientLink href="/" className="hover:text-white transition-colors">
              Inicio
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-white transition-colors">
              Tienda
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/collections" className="hover:text-white transition-colors">
              Colecciones
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-white font-medium">{collection.title}</span>
          </nav>

          {/* Title */}
          <h1 className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {collection.title}
          </h1>

          {/* Description */}
          {collection.metadata?.description && (
            <p className="text-white/90 text-base md:text-lg max-w-3xl">
              {collection.metadata.description as string}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Products Section */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <RefinementList sortBy={sort} data-testid="sort-by-container" />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={collection.products?.length ?? 12}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                collectionId={collection.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
