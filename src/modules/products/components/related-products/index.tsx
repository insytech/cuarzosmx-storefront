import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <span className="inline-flex items-center gap-2 text-main-color text-sm font-semibold uppercase tracking-wide mb-3">
          <span className="w-8 h-px bg-main-color" />
          También te puede interesar
          <span className="w-8 h-px bg-main-color" />
        </span>
        <h2 className="font-serenity text-3xl md:text-4xl font-bold text-gray-900">
          Productos Relacionados
        </h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Descubre más cuarzos y productos que complementan tu selección
        </p>
      </div>

      {/* Products Grid */}
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 8).map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
