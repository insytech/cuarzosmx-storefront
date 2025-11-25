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
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
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
          </nav>

          {/* Title */}
          <h1
            className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3"
            data-testid="store-page-title"
          >
            Todos los Productos
          </h1>

          {/* Description */}
          <p className="text-white/90 text-base md:text-lg max-w-3xl">
            Explora nuestra colección completa de cuarzos naturales, joyería artesanal y productos holísticos.
            Cada pieza es única y está cuidadosamente seleccionada para ti.
          </p>
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
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default StoreTemplate
