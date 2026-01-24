import { Suspense } from "react"
import Image from "next/image"

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

  // Obtener la imagen del signo zodiacal basado en el handle de la colección
  const getCollectionImage = (handle: string) => {
    const signos = [
      'acuario', 'aries', 'cancer', 'capricornio', 'escorpio',
      'geminis', 'leo', 'libra', 'piscis', 'sagitario', 'tauro', 'virgo'
    ]
    if (signos.includes(handle.toLowerCase())) {
      return `/signos/${handle.toUpperCase()}.webp`
    }
    return null
  }

  const backgroundImage = getCollectionImage(collection.handle)

  return (
    <>
      {/* Hero Section */}
      <div className="w-full relative overflow-hidden py-16 md:py-20">
        {/* Background Image */}
        {backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
              alt={collection.title}
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-r from-main-color/90 via-main-color-dark/80 to-purple-900/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-main-color via-main-color-dark to-purple-900" />
        )}
        {/* Content */}
        <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
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
          <h1 className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {collection.title}
          </h1>

          {/* Description */}
          {collection.metadata?.description && (
            <p className="text-white/90 text-base md:text-lg max-w-3xl drop-shadow-md">
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
