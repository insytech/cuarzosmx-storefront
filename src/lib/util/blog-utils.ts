import * as DOMPurify from 'dompurify'
import { marked } from 'marked'

export const sanitizeHtml = (markdown: string): string => {
    const html = marked.parse(markdown) as string

    return DOMPurify.default.sanitize(html, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: [
            'allow', 'allowfullscreen', 'frameborder',
            'scrolling', 'src', 'width', 'height'
        ],
        ALLOWED_URI_REGEXP: /^https:\/\/(www\.)?(youtube\.com\/embed\/|vimeo\.com\/)/
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