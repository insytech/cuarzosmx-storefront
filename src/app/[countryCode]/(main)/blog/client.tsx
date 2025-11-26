"use client"

import { useBlogPosts } from "@hooks/use-blog-posts"
import BlogList from "@modules/blog/components/blog-list"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BlogPageClient() {
    const { posts, isLoading, error, hasNextPage, loadMore } = useBlogPosts({
        limit: 12
    })

    return (
        <div className="bg-gradient-to-b from-main-color-light/30 to-white min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-main-color/10 rounded-full blur-3xl" />
                    <div className="absolute top-20 -left-20 w-60 h-60 bg-main-color-light rounded-full blur-2xl" />
                </div>

                <div className="container mx-auto px-4 py-12 md:py-16 relative">
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
                            <li className="text-main-color font-medium">Blog</li>
                        </ol>
                    </nav>

                    {/* Título */}
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-main-color font-medium mb-6 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            Artículos y guías
                        </div>

                        <h1 className="font-serenity text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Nuestro <span className="text-main-color">Blog</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            Explora el fascinante mundo de los cristales, minerales y la espiritualidad.
                            Encuentra guías, consejos y conocimientos ancestrales.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lista de posts */}
            <div className="container mx-auto px-4 pb-16">
                <BlogList
                    posts={posts}
                    isLoading={isLoading}
                    error={error || undefined}
                    onLoadMore={loadMore}
                    hasNextPage={hasNextPage}
                />
            </div>
        </div>
    )
}