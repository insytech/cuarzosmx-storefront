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
            className={`
                blog-content
                prose prose-lg max-w-none
                prose-headings:font-serenity
                prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:text-gray-900 prose-h1:mb-6
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:text-gray-800 prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:text-gray-800 prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-main-color prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-main-color-dark
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ul:pl-6 prose-ul:list-disc
                prose-ol:my-4 prose-ol:pl-6 prose-ol:list-decimal
                prose-li:text-gray-700 prose-li:mb-2 prose-li:pl-2
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4
                [&_li]:mb-2 [&_li]:text-gray-700
                [&_li::marker]:text-main-color
                prose-blockquote:border-l-4 prose-blockquote:border-main-color prose-blockquote:bg-main-color-light/40 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:not-italic prose-blockquote:my-6
                prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:w-full prose-img:max-h-[500px] prose-img:object-cover prose-img:mx-auto
                [&_img]:w-full [&_img]:max-h-[500px] [&_img]:object-cover [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-8
                [&_figure]:my-8 [&_figure]:mx-auto
                [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_figcaption]:mt-3 [&_figcaption]:italic
                prose-hr:border-main-color-light prose-hr:my-8
                prose-code:bg-main-color-light prose-code:text-main-color-dark prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg
                ${className}
            `}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    )
}

export default BlogContent