import * as DOMPurify from 'dompurify'
import { marked } from 'marked'

export const sanitizeHtml = (markdown: string): string => {
    // Check if the content is already HTML (contains HTML tags)
    const isHtml = /<[^>]*>/.test(markdown)

    let html: string
    if (isHtml) {
        // If it's already HTML, use it directly
        html = markdown
    } else {
        // If it's markdown, parse it
        html = marked.parse(markdown) as string
    }

    return DOMPurify.default.sanitize(html, {
        ADD_TAGS: ['iframe', 'img', 'div'],
        ADD_ATTR: [
            'allow', 'allowfullscreen', 'frameborder',
            'scrolling', 'src', 'width', 'height', 'alt', 'class', 'style', 'data-youtube-video'
        ],
        ALLOWED_URI_REGEXP: /^https?:\/\/.*/,
        ALLOW_DATA_ATTR: false
    })
}

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export const getExcerpt = (markdown: string, maxLength = 150): string => {
    const text = (marked.parse(markdown) as string).replace(/<[^>]*>/g, '')
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export const getImageUrl = (thumbnailUrl: string | null): string | null => {
    if (!thumbnailUrl) return null

    // If it's already a full URL (starts with http/https), return as is
    if (thumbnailUrl.startsWith('http://') || thumbnailUrl.startsWith('https://')) {
        return thumbnailUrl
    }

    // If it's a relative path, construct full URL based on environment
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

    // Remove trailing slash from base URL
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')

    // Remove leading slash from thumbnail URL
    const cleanThumbnailUrl = thumbnailUrl.replace(/^\//, '')

    return `${cleanBaseUrl}/${cleanThumbnailUrl}`
}

export const processMarkdownImages = (markdown: string): string => {
    // Handle both markdown image syntax and HTML img tags

    // First, handle markdown image syntax: ![alt](src)
    let processed = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        const processedUrl = getImageUrl(src) || src
        return `![${alt}](${processedUrl})`
    })

    // Then, handle HTML img tags: <img src="..." alt="..." />
    processed = processed.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/g, (match, before, src, after) => {
        const processedUrl = getImageUrl(src) || src
        return `<img${before}src="${processedUrl}"${after}>`
    })

    return processed
}
