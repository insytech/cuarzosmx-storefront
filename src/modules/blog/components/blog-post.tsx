import { BlogPost as BlogPostType } from "../../../types/global"
import BlogContent from "./blog-content"
import { formatDate, getImageUrl } from "@util/blog-utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface BlogPostProps {
    post: BlogPostType | null
    isLoading: boolean
    error?: string
}

const BlogPost = ({ post, isLoading, error }: BlogPostProps) => {
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

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto animate-pulse">
                {/* Imagen skeleton */}
                <div className="h-64 md:h-96 bg-main-color-light rounded-2xl mb-8" />

                {/* Header skeleton */}
                <div className="mb-8">
                    <div className="h-10 bg-main-color-light rounded-lg w-3/4 mb-4" />
                    <div className="h-5 bg-gray-200 rounded w-1/4" />
                </div>

                {/* Content skeleton */}
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-main-color-light flex items-center justify-center">
                    <svg className="w-10 h-10 text-main-color" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <h3 className="font-serenity text-xl font-semibold text-gray-900 mb-2">Artículo no encontrado</h3>
                <p className="text-gray-500 mb-6">El artículo que buscas no existe o ha sido eliminado.</p>
                <LocalizedClientLink
                    href="/blog"
                    className="inline-flex items-center gap-2 bg-main-color text-white px-6 py-3 rounded-full hover:bg-main-color-dark transition-colors font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al blog
                </LocalizedClientLink>
            </div>
        )
    }

    return (
        <article className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-gray-500">
                    <li>
                        <LocalizedClientLink href="/" className="hover:text-main-color transition-colors">
                            Inicio
                        </LocalizedClientLink>
                    </li>
                    <li>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </li>
                    <li>
                        <LocalizedClientLink href="/blog" className="hover:text-main-color transition-colors">
                            Blog
                        </LocalizedClientLink>
                    </li>
                    <li>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </li>
                    <li className="text-main-color font-medium truncate max-w-[200px]">
                        {post.title}
                    </li>
                </ol>
            </nav>

            {/* Header del artículo */}
            <header className="mb-10">
                <h1 className="font-serenity text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {/* Fecha de publicación */}
                    <div className="flex items-center gap-2 bg-main-color-light px-4 py-2 rounded-full">
                        <svg className="w-4 h-4 text-main-color" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time dateTime={post.created_at} className="text-main-color-dark font-medium">
                            {formatDate(post.created_at)}
                        </time>
                    </div>

                    {/* Fecha de actualización */}
                    {post.updated_at !== post.created_at && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Actualizado: {formatDate(post.updated_at)}</span>
                        </div>
                    )}
                </div>
            </header>
            {/* Imagen principal */}
            {post.thumbnail_url && (
                <div className="mb-8 relative rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src={getImageUrl(post.thumbnail_url) || undefined}
                        alt={post.title}
                        className="w-full h-64 md:h-[400px] lg:h-[500px] object-cover"
                    />
                    {/* Overlay decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
            )}


            {/* Contenido del artículo */}
            <div className="prose prose-lg max-w-none prose-headings:font-serenity prose-headings:text-gray-900 prose-a:text-main-color prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-l-main-color prose-blockquote:bg-main-color-light/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
                <BlogContent markdown={post.body_markdown} />
            </div>

            {/* Footer del artículo */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Compartir */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Compartir:</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="w-9 h-9 rounded-full bg-main-color-light hover:bg-main-color text-main-color hover:text-white transition-colors flex items-center justify-center"
                                aria-label="Compartir en Facebook"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${window.location.href}`)}`, '_blank')}
                                className="w-9 h-9 rounded-full bg-main-color-light hover:bg-[#25D366] text-main-color hover:text-white transition-colors flex items-center justify-center"
                                aria-label="Compartir en WhatsApp"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Volver al blog */}
                    <LocalizedClientLink
                        href="/blog"
                        className="inline-flex items-center gap-2 text-main-color hover:text-main-color-dark font-medium transition-colors group"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al blog
                    </LocalizedClientLink>
                </div>
            </footer>
        </article>
    )
}

export default BlogPost