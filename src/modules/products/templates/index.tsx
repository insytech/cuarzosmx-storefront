import React, { Suspense } from "react"

import ProductGalleryWithVariants from "@modules/products/components/product-gallery-with-variants"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductSchema from "@modules/common/components/product-schema"
import BreadcrumbSchema from "@modules/common/components/breadcrumb-schema"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Breadcrumb items para Schema.org
  const breadcrumbItems = [
    { name: "Inicio", url: "/" },
    { name: "Tienda", url: "/store" },
    ...(product.collection
      ? [
        {
          name: product.collection.title,
          url: `/collections/${product.collection.handle}`,
        },
      ]
      : []),
    { name: product.title, url: `/products/${product.handle}` },
  ]

  return (
    <>
      {/* Schema.org JSON-LD */}
      <ProductSchema product={product} url={`/products/${product.handle}`} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="content-container max-w-7xl mx-auto py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <LocalizedClientLink href="/" className="hover:text-main-color transition-colors">
              Inicio
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-main-color transition-colors">
              Tienda
            </LocalizedClientLink>
            {product.collection && (
              <>
                <span>/</span>
                <LocalizedClientLink
                  href={`/collections/${product.collection.handle}`}
                  className="hover:text-main-color transition-colors"
                >
                  {product.collection.title}
                </LocalizedClientLink>
              </>
            )}
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div
        className="content-container max-w-7xl mx-auto py-8 md:py-12"
        data-testid="product-container"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Images */}
          <div className="order-1">
            <ProductGalleryWithVariants images={product?.images || []} thumbnail={product?.thumbnail} />
          </div>

          {/* Right Column - Product Details */}
          <div className="order-2 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-8">
              {/* Product Info */}
              <ProductInfo product={product} />

              {/* Product Actions (Price, Options, Add to Cart) */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <ProductOnboardingCta />
                <Suspense
                  fallback={
                    <ProductActions
                      disabled={true}
                      product={product}
                      region={region}
                    />
                  }
                >
                  <ProductActionsWrapper id={product.id} region={region} />
                </Suspense>
              </div>

              {/* Trust Badges - Responsive */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-6 py-3 px-3 sm:px-4 bg-gradient-to-r from-purple-50 via-white to-purple-50 rounded-xl border border-purple-100">
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <div className="w-6 h-6 bg-main-color/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-main-color" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">100% Original</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-purple-200" />
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <div className="w-6 h-6 bg-main-color/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-main-color" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">Envío Seguro</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-purple-200" />
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <div className="w-6 h-6 bg-main-color/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-main-color" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">Pago Seguro</span>
                </div>
              </div>

              {/* Product Tabs */}
              <ProductTabs product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div
          className="content-container max-w-7xl mx-auto px-4 lg:px-8"
          data-testid="related-products-container"
        >
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
