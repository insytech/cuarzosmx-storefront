import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

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
            {parents?.reverse().map((parent) => (
              <span key={parent.id} className="flex items-center gap-2">
                <span>/</span>
                <LocalizedClientLink
                  className="hover:text-white transition-colors"
                  href={`/categories/${parent.handle}`}
                >
                  {parent.name}
                </LocalizedClientLink>
              </span>
            ))}
            <span>/</span>
            <span className="text-white font-medium">{category.name}</span>
          </nav>

          {/* Title */}
          <h1 className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {category.name}
          </h1>

          {/* Description */}
          {category.description && (
            <p className="text-white/90 text-base md:text-lg max-w-3xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Subcategories */}
        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Subcategorías</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.category_children?.map((c) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-main-color hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium group-hover:text-main-color transition-colors">
                      {c.name}
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-main-color group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        )}

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
                  numberOfProducts={category.products?.length ?? 12}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
