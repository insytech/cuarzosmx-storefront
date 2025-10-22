"use client"

import { useBlogPosts } from "@hooks/use-blog-posts"
import BlogList from "@modules/blog/components/blog-list"

export default function BlogPageClient() {
    const { posts, isLoading, error, hasNextPage, loadMore } = useBlogPosts({
        limit: 12
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
                <p className="text-lg text-gray-600">
                    Descubre nuestros artículos sobre cristales, minerales y espiritualidad.
                </p>
            </div>

            <BlogList
                posts={posts}
                isLoading={isLoading}
                error={error || undefined}
                onLoadMore={loadMore}
                hasNextPage={hasNextPage}
            />
        </div>
    )
}