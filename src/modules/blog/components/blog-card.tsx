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
        <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            {post.thumbnail_url && (
                <div className="aspect-video overflow-hidden">
                    <img
                        src={getImageUrl(post.thumbnail_url) || undefined}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                </div>
            )}

            <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <time dateTime={post.created_at}>
                        {formatDate(post.created_at)}
                    </time>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    <LocalizedClientLink href={`/blog/${post.url_slug}`}>
                        {post.title}
                    </LocalizedClientLink>
                </h3>

                {showExcerpt && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {getExcerpt(post.body_markdown, excerptLength)}
                    </p>
                )}

                <div className="mt-4">
                    <LocalizedClientLink
                        href={`/blog/${post.url_slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Leer más →
                    </LocalizedClientLink>
                </div>
            </div>
        </div>
    )
}

export default BlogCard