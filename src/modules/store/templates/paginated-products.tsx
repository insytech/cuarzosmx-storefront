import { HttpTypes } from "@medusajs/types"
import { listProducts, listProductsWithSort } from "@lib/data/products"
import { getSortableMinPrice, sortProducts } from "@lib/util/sort-products"
import { expandCategoryIds } from "@lib/util/category-tree"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PRODUCT_LIMIT = 12

// Page size used when the whole matching set has to be pulled into memory.
const BULK_PAGE_SIZE = 200
// Hard ceiling on the in-memory path so a runaway catalog can never turn a
// single page view into an unbounded number of backend calls. If this trips we
// log loudly instead of silently truncating the result set.
const BULK_MAX_PRODUCTS = 5000

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

/**
 * A product is considered available when at least one of its variants can
 * actually be bought. Products flagged as sellable without stock
 * (`manage_inventory: false`) or with backorders enabled stay visible on
 * purpose — only genuinely depleted, inventory-managed products are hidden.
 */
const isAvailable = (product: HttpTypes.StoreProduct) =>
  (product.variants ?? []).some(
    (variant) =>
      variant.manage_inventory === false ||
      variant.allow_backorder === true ||
      (variant.inventory_quantity ?? 0) > 0
  )

/**
 * Fetches every product matching `queryParams`, page by page.
 *
 * Medusa v2 cannot order or filter by `calculated_price` at the API layer, and
 * stock availability depends on per-variant flags, so those filters have to run
 * in memory over the full matching set.
 */
const fetchAllMatchingProducts = async (
  queryParams: PaginatedProductsParams,
  countryCode: string
): Promise<HttpTypes.StoreProduct[]> => {
  const bulkParams = { ...queryParams, limit: BULK_PAGE_SIZE }

  const {
    response: { products: firstPage, count: total },
  } = await listProducts({ pageParam: 1, queryParams: bulkParams, countryCode })

  const reachable = Math.min(total, BULK_MAX_PRODUCTS)
  const pages = Math.ceil(reachable / BULK_PAGE_SIZE)

  let products = firstPage

  if (pages > 1) {
    const rest = await Promise.all(
      Array.from({ length: pages - 1 }, (_, index) =>
        listProducts({
          pageParam: index + 2,
          queryParams: bulkParams,
          countryCode,
        })
      )
    )
    products = products.concat(...rest.map((r) => r.response.products))
  }

  if (total > BULK_MAX_PRODUCTS) {
    console.warn(
      `[paginated-products] In-memory filtering truncated: ${total} products match ` +
        `but only ${products.length} were fetched (cap: ${BULK_MAX_PRODUCTS}). ` +
        `Price/stock filters are now returning incomplete results — add a ` +
        `precomputed min_price/availability field and filter server-side.`
    )
  }

  return products
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  searchQuery,
  minPrice,
  maxPrice,
  categoryIds,
  inStock,
  allCategories,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  categoryIds?: string[]
  inStock?: boolean
  /**
   * Full category list, used to expand a selected category into its
   * subcategories. Optional: callers that already fetched it (StoreTemplate,
   * CollectionTemplate) pass it down to avoid a second fetch; anyone else gets
   * a fallback fetch below, which is cheap because listCategories() is
   * force-cached.
   */
  allCategories?: HttpTypes.StoreProductCategory[]
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  // Usar categoryIds del filtro o el categoryId individual.
  //
  // Medusa v2's `category_id[]` filter is not recursive: it matches only the
  // products assigned *directly* to the given categories. Filtering by (or
  // browsing) a parent like "Cuarzos Decorativos" therefore hid every product
  // that lives only in one of its subcategories — 16 of 82 were visible.
  //
  // Both entry points (the /store sidebar filter and the /categories/[handle]
  // page) expand to "self + every descendant, any depth" through the same
  // helper, so they can never drift apart. Leaf categories have no
  // descendants, so expandCategoryIds is a no-op for them.
  const selectedCategoryIds =
    categoryIds && categoryIds.length > 0
      ? categoryIds
      : categoryId
        ? [categoryId]
        : []

  if (selectedCategoryIds.length > 0) {
    const categories = allCategories ?? (await listCategories())
    queryParams.category_id = expandCategoryIds(categories, selectedCategoryIds)
  }

  if (productsIds) {
    queryParams.id = productsIds
  }

  // Añadir búsqueda
  if (searchQuery) {
    queryParams.q = searchQuery
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined
  const isPriceSort = sortBy === "price_asc" || sortBy === "price_desc"
  const hasStockFilter = inStock === true

  let paginatedProducts: HttpTypes.StoreProduct[]
  let count: number

  if (hasPriceFilter || isPriceSort || hasStockFilter) {
    // Medusa v2 can't order or filter by calculated_price at the API layer
    // (ProductVariant.calculated_price is not a real column — the API 500s),
    // and stock availability depends on per-variant flags, so fetch the full
    // matching set and filter/sort/paginate in memory.
    // The catalog is ~487 products as of 2026-08; fetchAllMatchingProducts
    // pages through it and warns instead of truncating silently.
    const allProducts = await fetchAllMatchingProducts(queryParams, countryCode)

    const filtered = allProducts.filter((p) => {
      if (hasStockFilter && !isAvailable(p)) return false

      if (!hasPriceFilter) return true

      // A price of 0 or a missing price means "no price" (WhatsApp showcase
      // items): they stay in the catalog but fall out of explicit price ranges.
      const price = getSortableMinPrice(p)
      if (price === null) return false
      if (minPrice !== undefined && price < minPrice) return false
      if (maxPrice !== undefined && price > maxPrice) return false
      return true
    })

    const sorted = sortProducts(filtered, sortBy || "created_at")
    count = sorted.length
    const start = (page - 1) * PRODUCT_LIMIT
    paginatedProducts = sorted.slice(start, start + PRODUCT_LIMIT)
  } else {
    const {
      response: { products, count: total },
    } = await listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
    })
    paginatedProducts = products
    count = total
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  // Si no hay resultados
  if (paginatedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 mb-6 rounded-full bg-main-color-light flex items-center justify-center">
          <svg className="w-10 h-10 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="font-serenity text-xl font-semibold text-gray-900 mb-2">
          {searchQuery ? "No encontramos productos" : "No hay productos disponibles"}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {searchQuery
            ? `No hay productos que coincidan con "${searchQuery}". Intenta con otros términos o explora nuestras categorías.`
            : ((categoryIds && categoryIds.length > 0) || hasPriceFilter || hasStockFilter)
              ? "No hay productos que coincidan con los filtros seleccionados. Prueba ajustando los filtros."
              : "Pronto agregaremos más productos a nuestra tienda."}
        </p>
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center gap-2 bg-main-color text-white px-6 py-3 rounded-full hover:bg-main-color-dark transition-colors font-medium"
        >
          Ver todos los productos
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <>
      {/* Contador de resultados */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-medium">{paginatedProducts.length}</span> de <span className="font-medium">{count}</span> productos
        </p>
      </div>

      <ul
        className="grid grid-cols-2 w-full sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6"
        data-testid="products-list"
      >
        {paginatedProducts.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
