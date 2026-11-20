import { cache } from "react"
import { sdk } from "../config"
import { BlogPost, BlogPostsResponse, BlogPostResponse } from "../../types/global"

/** Tag global del blog (lista y posts); lo limpia `/api/revalidate`. */
export const BLOG_CACHE_TAG = "blog"

/** Tag de un post; lo limpia `/api/revalidate` con `{ blog: [slug] }`. */
export const blogPostCacheTag = (slug: string) => `${BLOG_CACHE_TAG}-${slug}`

/** Respaldo por tiempo: una edicion en el admin aparece a mas tardar en 1 h. */
export const BLOG_REVALIDATE_SECONDS = 3600

/** Post como lo devuelve `GET /store/blog/:slug`, con los campos SEO nuevos. */
export type StoreBlogPost = BlogPost & {
    seo_keywords?: string | null
    previous_slugs?: string[] | null
}

/**
 * Respuesta de `GET /store/blog/:slug`: el post, o `redirect_to` con el slug
 * actual cuando el pedido usa una URL anterior de un post publicado (S5).
 */
type StoreBlogPostResponse = { post?: StoreBlogPost; redirect_to?: string }

export type BlogPostLookup =
    | { post: StoreBlogPost }
    | { redirect: string }
    | null

/**
 * Post por slug para Server Components (pagina y `generateMetadata`):
 * - `{ post }` si existe y esta publicado;
 * - `{ redirect: slug }` si `slug` es una URL anterior del post (la pagina hace
 *   el 301 al slug actual);
 * - `null` si el backend responde 404, para que la pagina llame a `notFound()`.
 * Cualquier otro error se propaga. `cache` evita pedirlo dos veces en el mismo
 * render.
 */
export const getBlogPostBySlug = cache(
    async (slug: string): Promise<BlogPostLookup> => {
        try {
            const { post, redirect_to } =
                await sdk.client.fetch<StoreBlogPostResponse>(
                    `/store/blog/${encodeURIComponent(slug)}`,
                    {
                        method: "GET",
                        cache: "force-cache",
                        next: {
                            revalidate: BLOG_REVALIDATE_SECONDS,
                            tags: [BLOG_CACHE_TAG, blogPostCacheTag(slug)],
                        },
                    }
                )
            if (post) {
                return { post }
            }
            // Un redirect al mismo slug seria un bucle: se trata como 404.
            if (typeof redirect_to === "string" && redirect_to && redirect_to !== slug) {
                return { redirect: redirect_to }
            }
            return null
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