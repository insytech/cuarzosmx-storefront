import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

/**
 * Global tag shared by every category fetch. `/api/revalidate` clears it when
 * the backend reports a category change (see `categories` in that payload).
 */
export const CATEGORIES_CACHE_TAG = "categories"

/**
 * Time-based fallback so an admin edit shows up even if the revalidate call
 * from the backend never arrives.
 */
const CATEGORIES_REVALIDATE_SECONDS = 300

const CATEGORY_FIELDS =
  "*category_children, *parent_category, *parent_category.parent_category, metadata"

const getCategoriesNextOptions = async () => {
  const visitorOptions = (await getCacheOptions("categories")) as {
    tags?: string[]
  }

  return {
    tags: [CATEGORIES_CACHE_TAG, ...(visitorOptions.tags ?? [])],
    revalidate: CATEGORIES_REVALIDATE_SECONDS,
  }
}

export const listCategories = async (query?: Record<string, any>) => {
  const next = await getCategoriesNextOptions()

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields: CATEGORY_FIELDS,
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  // Get the last handle in the path (the actual category we want)
  const handle = categoryHandle[categoryHandle.length - 1]

  const next = await getCategoriesNextOptions()

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      "/store/product-categories",
      {
        query: {
          fields: CATEGORY_FIELDS,
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
