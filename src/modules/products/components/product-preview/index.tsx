import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  imageClassName,
  showPrice,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  imageClassName?: string
  showPrice?: boolean
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group w-full">
      <div data-testid="product-wrapper" className="flex flex-col h-full">
        {/* Imagen cuadrada con efecto hover */}
        <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 group/image flex items-center justify-center">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
            className={imageClassName ? imageClassName : "transition-transform duration-300 ease-in-out group-hover/image:scale-110 object-cover w-full h-full"}
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg" />
        </div>

        {/* Contenido del producto */}
        <div className="flex flex-col gap-2 mt-4">
          {/* Nombre del producto */}
          <Text
            className="text-black font-semibold text-base leading-snug line-clamp-2 group-hover:text-main-color transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </Text>

          {/* Precio */}
          {cheapestPrice && (
            <div className="flex items-center">
              <span className="text-main-color font-bold text-lg">
                <PreviewPrice price={cheapestPrice} />
              </span>
            </div>
          )}

          {/* Pequeña descripción si existe */}
          {product.description && (
            <p className="text-main-color-dark text-xs line-clamp-1 opacity-70 mt-1">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
