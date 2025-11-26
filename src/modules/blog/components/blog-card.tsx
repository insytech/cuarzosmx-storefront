import { BlogPost } from "../../../types/global"
import LocalizedClientLink from "../../common/components/localized-client-link"
import { getExcerpt, formatDate, getImageUrl } from "@util/blog-utils"

interface BlogCardProps {
    post: BlogPost
    showExcerpt?: boolean
    excerptLength?: number
}

const BlogCard = ({
    post,
    showExcerpt = true,
    excerptLength = 150
}: BlogCardProps) => {
    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-main-color-light">
            {/* Imagen con overlay decorativo */}
            <LocalizedClientLink href={`/blog/${post.url_slug}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-main-color-light">
                    {post.thumbnail_url ? (
                        <img
                            src={getImageUrl(post.thumbnail_url) || undefined}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-main-color/30" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Decoración de cristal */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-main-color" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                </div>
            </LocalizedClientLink>

            <div className="p-5 sm:p-6">
                {/* Fecha con icono */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 text-main-color" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={post.created_at}>
                        {formatDate(post.created_at)}
                    </time>
                </div>

                {/* Título */}
                <h3 className="font-serenity text-xl font-semibold text-gray-900 mb-3 group-hover:text-main-color transition-colors duration-300 line-clamp-2">
                    <LocalizedClientLink href={`/blog/${post.url_slug}`}>
                        {post.title}
                    </LocalizedClientLink>
                </h3>

                {/* Extracto */}
                {showExcerpt && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {getExcerpt(post.body_markdown, excerptLength)}
                    </p>
                )}

                {/* Link para leer más */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <LocalizedClientLink
                        href={`/blog/${post.url_slug}`}
                        className="inline-flex items-center gap-2 text-main-color hover:text-main-color-dark text-sm font-medium group/link transition-colors"
                    >
                        <span>Leer artículo</span>
                        <svg
                            className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </LocalizedClientLink>
                </div>
            </div>
        </div>
    )
}

export default BlogCard