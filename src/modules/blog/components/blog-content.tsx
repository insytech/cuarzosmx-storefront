import { sanitizeHtml } from "@util/blog-utils"

interface BlogContentProps {
    markdown: string
    className?: string
}

const BlogContent = ({ markdown, className = "" }: BlogContentProps) => {
    const htmlContent = sanitizeHtml(markdown)

    return (
        <div
            className={`prose prose-lg max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    )
}

export default BlogContent