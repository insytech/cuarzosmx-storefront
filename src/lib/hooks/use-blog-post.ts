import { useState, useEffect } from 'react'
import { blogApi } from '../util/blog-api'
import { BlogPost } from '../../types/global'

interface UseBlogPostReturn {
    post: BlogPost | null
    isLoading: boolean
    error: string | null
}

export const useBlogPost = (slug: string): UseBlogPostReturn => {
    const [post, setPost] = useState<BlogPost | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return

        const fetchPost = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await blogApi.getPost(slug)
                setPost(response.post)
            } catch (err: any) {
                if (err?.status === 404) {
                    setError('Post not found')
                } else {
                    setError('Failed to load blog post')
                }
                console.error('Error fetching blog post:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    return {
        post,
        isLoading,
        error,
    }
}