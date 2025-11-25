import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-4">
        {/* Collection Badge */}
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="inline-flex items-center gap-2 bg-main-color-light text-main-color px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide w-fit hover:bg-main-color hover:text-white transition-colors duration-200"
          >
            <span className="w-1.5 h-1.5 bg-current rounded-full" />
            {product.collection.title}
          </LocalizedClientLink>
        )}

        {/* Product Title */}
        <h1
          className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        {/* Product Subtitle/Type */}
        {product.subtitle && (
          <p className="text-lg text-gray-500 font-light">
            {product.subtitle}
          </p>
        )}

        {/* Divider */}
        <div className="w-16 h-1 bg-main-color rounded-full" />

        {/* Description */}
        {product.description && (
          <p
            className="text-base text-gray-600 leading-relaxed whitespace-pre-line"
            data-testid="product-description"
          >
            {product.description}
          </p>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {product.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
