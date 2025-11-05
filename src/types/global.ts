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

export type Banner = {
  id: string
  title: string
  image_url: string
  image_key?: string
  link_url?: string
  position: 'main' | 'right_1' | 'right_2' | 'right_3' | 'right_4'
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type PromotionMessage = {
  id: string
  message: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type BannerResponse = {
  banners: Banner[]
  promotionMessage: PromotionMessage | null
}
