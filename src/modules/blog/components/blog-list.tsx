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
            <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-red-600 mb-4 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 bg-main-color text-white px-6 py-3 rounded-full hover:bg-main-color-dark transition-colors font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reintentar
                </button>
            </div>
        )
    }

    if (posts.length === 0 && !isLoading) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-main-color-light flex items-center justify-center">
                    <svg className="w-10 h-10 text-main-color" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                </div>
                <h3 className="font-serenity text-xl font-semibold text-gray-900 mb-2">No hay artículos disponibles</h3>
                <p className="text-gray-500">Pronto publicaremos nuevo contenido sobre cristales y espiritualidad.</p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Grid de posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="text-center py-10">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-main-color-light rounded-full">
                        <div className="w-5 h-5 border-2 border-main-color border-t-transparent rounded-full animate-spin" />
                        <span className="text-main-color-dark font-medium">Cargando artículos...</span>
                    </div>
                </div>
            )}

            {/* Load more button */}
            {hasNextPage && !isLoading && onLoadMore && (
                <div className="text-center py-8">
                    <button
                        onClick={onLoadMore}
                        className="inline-flex items-center gap-2 bg-white text-main-color border-2 border-main-color px-8 py-3 rounded-full hover:bg-main-color hover:text-white transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                    >
                        <span>Cargar más artículos</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default BlogList