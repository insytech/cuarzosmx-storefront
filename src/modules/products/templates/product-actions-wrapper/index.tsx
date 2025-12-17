import { retrieveCart } from "@lib/data/cart"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 * Also fetches the current cart to calculate accurate available quantities.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  const [product, cart] = await Promise.all([
    listProducts({
      queryParams: { id: [id] },
      regionId: region.id,
    }).then(({ response }) => response.products[0]),
    retrieveCart(),
  ])

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} cart={cart} />
}
