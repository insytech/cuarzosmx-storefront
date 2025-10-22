import { sdk } from "../config"
import { BlogPostsResponse, BlogPostResponse } from "../../types/global"

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