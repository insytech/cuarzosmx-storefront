import { sanitizeHtml, processMarkdownImages } from "@util/blog-utils"

interface BlogContentProps {
    markdown: string
    className?: string
}

const BlogContent = ({ markdown, className = "" }: BlogContentProps) => {
    // Process images in content (whether markdown or HTML) before sanitization
    const processedContent = processMarkdownImages(markdown)
    const htmlContent = sanitizeHtml(processedContent)

    return (
        <div
            className={`prose prose-lg max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    )
}

export default BlogContent