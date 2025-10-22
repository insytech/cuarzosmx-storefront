import { StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export type BlogPost = {
  id: string
  title: string
  url_slug: string
  body_markdown: string
  thumbnail_url?: string
  seo_title?: string
  seo_description?: string
  status: 'published'
  created_at: string
  updated_at: string
}

export type BlogPostsResponse = {
  posts: BlogPost[]
  count: number
  limit: number
  offset: number
}

export type BlogPostResponse = {
  post: BlogPost
}
