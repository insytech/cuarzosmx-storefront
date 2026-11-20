import { cache } from "react"
import { sdk } from "../config"
import { BlogPost, BlogPostsResponse, BlogPostResponse } from "../../types/global"

/** Tag global del blog y por post, para un `revalidateTag` futuro. */
export const BLOG_CACHE_TAG = "blog"

/** Respaldo por tiempo: una edicion en el admin aparece a mas tardar en 1 h. */
export const BLOG_REVALIDATE_SECONDS = 3600

/**
 * Post por slug para Server Components (pagina y `generateMetadata`). Devuelve
 * `null` si el backend responde 404 (no existe o no esta publicado), para que la
 * pagina llame a `notFound()`; cualquier otro error se propaga. `cache` evita
 * pedirlo dos veces en el mismo render.
 */
export const getBlogPostBySlug = cache(
    async (slug: string): Promise<BlogPost | null> => {
        try {
            const { post } = await sdk.client.fetch<BlogPostResponse>(
                `/store/blog/${encodeURIComponent(slug)}`,
                {
                    method: "GET",
                    cache: "force-cache",
                    next: {
                        revalidate: BLOG_REVALIDATE_SECONDS,
                        tags: [BLOG_CACHE_TAG, `blog-${slug}`],
                    },
                }
            )
            return post ?? null
        } catch (error: any) {
            if (error?.status === 404) {
                return null
            }
            throw error
        }
    }
)

export const blogApi = {
    async getPosts(limit = 10, offset = 0): Promise<BlogPostsResponse> {
        try {
            const response = await sdk.client.fetch<BlogPostsResponse>(
                "/store/blog",
                {
                    method: "GET",
                    query: {
                        limit,
                        offset,
                    },
                }
            )
            return response
        } catch (error) {
            console.error("Error fetching blog posts:", error)
            throw error
        }
    },

    async getPost(slug: string): Promise<BlogPostResponse> {
        try {
            const response = await sdk.client.fetch<BlogPostResponse>(
                `/store/blog/${slug}`,
                {
                    method: "GET",
                }
            )
            return response
        } catch (error) {
            console.error("Error fetching blog post:", error)
            throw error
        }
    }
}