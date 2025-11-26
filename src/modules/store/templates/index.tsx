import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  searchQuery,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchQuery?: string
}) => {
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
            <span className="text-white font-medium">Tienda</span>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-white font-medium">Búsqueda</span>
              </>
            )}
          </nav>

          {/* Title */}
          <h1
            className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3"
            data-testid="store-page-title"
          >
            {searchQuery ? (
              <>
                Resultados para: <span className="text-white/90">"{searchQuery}"</span>
              </>
            ) : (
              "Todos los Productos"
            )}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-base md:text-lg max-w-3xl">
            {searchQuery ? (
              "Mostrando productos que coinciden con tu búsqueda."
            ) : (
              "Explora nuestra colección completa de cuarzos naturales, joyería artesanal y productos holísticos. Cada pieza es única y está cuidadosamente seleccionada para ti."
            )}
          </p>

          {/* Clear search button */}
          {searchQuery && (
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar búsqueda
            </LocalizedClientLink>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <RefinementList sortBy={sort} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                searchQuery={searchQuery}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default StoreTemplate
