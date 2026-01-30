"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      "/store/products",
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * Search products by query string. Uses no-store cache for real-time results.
 */
export const searchProducts = async ({
  query,
  countryCode,
  limit = 50,
}: {
  query: string
  countryCode: string
  limit?: number
}): Promise<HttpTypes.StoreProduct[]> => {
  if (!query || query.length < 2) {
    return []
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return []
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // Use Medusa's native search with 'q' parameter
    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>("/store/products", {
      method: "GET",
      query: {
        limit,
        offset: 0,
        region_id: region.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        q: query,
      },
      headers,
      cache: "no-store",
    })

    return products ?? []
  } catch (error) {
    console.error("Search error:", error)
    return []
  }
}

/**
 * Fetches products with server-side sorting and pagination.
 * Delegates sorting and pagination to the Medusa API to avoid over-fetching.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  // Map sortBy to Medusa order param
  let order: string | undefined
  switch (sortBy) {
    case "price_asc":
      order = "variants.calculated_price.calculated_amount"
      break
    case "price_desc":
      order = "-variants.calculated_price.calculated_amount"
      break
    case "created_at":
    default:
      order = "-created_at"
      break
  }

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: page,
    queryParams: {
      ...queryParams,
      limit,
      order,
    },
    countryCode,
  })

  const nextPage = count > (page - 1) * limit + limit ? page + 1 : null

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams,
  }
}
