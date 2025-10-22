import { BlogPost as BlogPostType } from "../../../types/global"
import BlogContent from "./blog-content"
import { formatDate, getImageUrl } from "@util/blog-utils"

interface BlogPostProps {
    post: BlogPostType | null
    isLoading: boolean
    error?: string
}

const BlogPost = ({ post, isLoading, error }: BlogPostProps) => {
    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Post no encontrado.</p>
            </div>
        )
    }

    return (
        <article className="max-w-4xl mx-auto">
            {post.thumbnail_url && (
                <div className="mb-8">
                    <img
                        src={getImageUrl(post.thumbnail_url) || undefined}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-lg"
                    />
                </div>
            )}

            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {post.title}
                </h1>

                <div className="flex items-center text-gray-600 text-sm">
                    <time dateTime={post.created_at}>
                        {formatDate(post.created_at)}
                    </time>
                    {post.updated_at !== post.created_at && (
                        <span className="ml-4">
                            Actualizado: {formatDate(post.updated_at)}
                        </span>
                    )}
                </div>
            </header>

            <div className="prose prose-lg max-w-none">
                <BlogContent markdown={post.body_markdown} />
            </div>
        </article>
    )
}

export default BlogPost