import { BlogPost } from "../../../types/global"
import BlogCard from "./blog-card"

interface BlogListProps {
    posts: BlogPost[]
    isLoading: boolean
    error?: string
    onLoadMore?: () => void
    hasNextPage?: boolean
}

const BlogList = ({
    posts,
    isLoading,
    error,
    onLoadMore,
    hasNextPage
}: BlogListProps) => {
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

    if (posts.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No hay posts disponibles en este momento.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    <p className="mt-2 text-gray-600">Cargando posts...</p>
                </div>
            )}

            {hasNextPage && !isLoading && onLoadMore && (
                <div className="text-center py-8">
                    <button
                        onClick={onLoadMore}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Cargar más posts
                    </button>
                </div>
            )}
        </div>
    )
}

export default BlogList