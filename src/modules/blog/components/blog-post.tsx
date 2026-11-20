import { BlogPost as BlogPostType } from "../../../types/global"
import BlogContent from "./blog-content"
import BlogPostShare from "./blog-post-share"
import { formatDate, getImageUrl, getExcerpt } from "@util/blog-utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ArticleSchema from "@modules/common/components/article-schema"
import BreadcrumbSchema from "@modules/common/components/breadcrumb-schema"

interface BlogPostProps {
    post: BlogPostType
}

// Server Component: el H1 y el cuerpo del post van en el HTML del servidor
// (S3). Lo interactivo (compartir) vive en `blog-post-share.tsx`.
const BlogPost = ({ post }: BlogPostProps) => {
    // Breadcrumb items para Schema.org
    const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.url_slug}` },
    ]

    return (
        <article className="max-w-4xl mx-auto">
            {/* Schema.org JSON-LD */}
            <ArticleSchema
                title={post.title}
                description={getExcerpt(post.body_markdown, 160)}
                url={`/blog/${post.url_slug}`}
                image={post.thumbnail_url ? getImageUrl(post.thumbnail_url) ?? undefined : undefined}
                datePublished={post.created_at}
                dateModified={post.updated_at}
            />
            <BreadcrumbSchema items={breadcrumbItems} />

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
                    <BlogPostShare title={post.title} />

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