import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

/**
 * Minimum *sellable* price of a product, or `null` when the product has no
 * usable price.
 *
 * A `calculated_amount` of 0 is treated exactly like a missing price: the
 * catalog contains "ask on WhatsApp" showcase items whose price row is set to
 * 0. They must stay visible, but they are not priced, so they must not win the
 * cheapest slot on price_asc nor be matched by an explicit price range.
 *
 * Note: this intentionally differs from `getProductPrice` (display), which
 * keeps its own falsy check so those products render without a price instead of
 * "MX$0.00".
 */
export function getSortableMinPrice(
  product: HttpTypes.StoreProduct
): number | null {
  const amounts = (product.variants ?? [])
    .map((variant) => variant?.calculated_price?.calculated_amount)
    .filter(
      (amount): amount is number => typeof amount === "number" && amount > 0
    )

  return amounts.length > 0 ? Math.min(...amounts) : null
}

/**
 * Helper function to sort products by price until the store API supports sorting by price
 *
 * Returns a new array and never writes to the product objects: the products
 * come from a `next: { revalidate }` fetch cache and mutating them would
 * corrupt the cached payload for every other request.
 *
 * Products with no usable price sort LAST in both price directions — they have
 * no price to compare, so they belong at the end of the list either way rather
 * than pretending to be the cheapest (price_asc) or the most expensive
 * (price_desc).
 *
 * @param products
 * @param sortBy
 * @returns a new, sorted array of products
 */
export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] {
  const sortedProducts = [...products]

  if (sortBy === "price_asc" || sortBy === "price_desc") {
    // Precompute the minimum price once per product, keyed by object identity
    // so nothing is written onto the (cached) product payloads.
    const minPrices = new Map<HttpTypes.StoreProduct, number | null>(
      sortedProducts.map((product) => [product, getSortableMinPrice(product)])
    )

    sortedProducts.sort((a, b) => {
      const priceA = minPrices.get(a) ?? null
      const priceB = minPrices.get(b) ?? null

      if (priceA === null && priceB === null) return 0
      if (priceA === null) return 1
      if (priceB === null) return -1

      return sortBy === "price_asc" ? priceA - priceB : priceB - priceA
    })
  }

  if (sortBy === "created_at") {
    sortedProducts.sort((a, b) => {
      return (
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      )
    })
  }

  return sortedProducts
}
