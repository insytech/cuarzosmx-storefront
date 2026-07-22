import { HttpTypes } from "@medusajs/types"
import { listProducts, listProductsWithSort } from "@lib/data/products"
import { sortProducts } from "@lib/util/sort-products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
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
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  // Usar categoryIds del filtro o el categoryId individual
  if (categoryIds && categoryIds.length > 0) {
    queryParams.category_id = categoryIds
  } else if (categoryId) {
    queryParams.category_id = [categoryId]
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

  let paginatedProducts: HttpTypes.StoreProduct[]
  let count: number

  if (hasPriceFilter || isPriceSort) {
    // Medusa v2 can't order or filter by calculated_price at the API layer
    // (ProductVariant.calculated_price is not a real column — the API 500s), so
    // fetch the full matching set and sort/filter/paginate in memory.
    // ponytail: fetch-all works for this small (~22 product) catalog; if it grows,
    // add a precomputed min_price field and paginate server-side.
    const {
      response: { products: allProducts },
    } = await listProducts({
      pageParam: 1,
      queryParams: { ...queryParams, limit: 1000 },
      countryCode,
    })

    const getMinPrice = (p: HttpTypes.StoreProduct) =>
      p.variants && p.variants.length > 0
        ? Math.min(
            ...p.variants.map(
              (v) => v?.calculated_price?.calculated_amount ?? Infinity
            )
          )
        : Infinity

    const filtered = allProducts.filter((p) => {
      if (!hasPriceFilter) return true
      const price = getMinPrice(p)
      if (price === Infinity) return false
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
            : (categoryIds && categoryIds.length > 0)
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
