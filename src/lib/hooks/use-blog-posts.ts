import { useState, useEffect } from 'react'
import { blogApi } from '../util/blog-api'
import { BlogPost } from '../../types/global'

interface UseBlogPostsOptions {
    limit?: number
    initialOffset?: number
}

interface UseBlogPostsReturn {
    posts: BlogPost[]
    isLoading: boolean
    error: string | null
    hasNextPage: boolean
    loadMore: () => void
    totalCount: number
}

export const useBlogPosts = (options: UseBlogPostsOptions = {}): UseBlogPostsReturn => {
    const { limit = 12, initialOffset = 0 } = options

    const [posts, setPosts] = useState<BlogPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalCount, setTotalCount] = useState(0)
    const [offset, setOffset] = useState(initialOffset)

    const fetchPosts = async (currentOffset = 0) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await blogApi.getPosts(limit, currentOffset)
            setPosts(currentOffset === 0 ? response.posts : [...posts, ...response.posts])
            setTotalCount(response.count)
            setOffset(currentOffset + limit)
        } catch (err) {
            setError('Failed to load blog posts')
            console.error('Error fetching blog posts:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const hasNextPage = posts.length < totalCount

    const loadMore = () => {
        if (hasNextPage && !isLoading) {
            fetchPosts(offset)
        }
    }

    return {
        posts,
        isLoading,
        error,
        hasNextPage,
        loadMore,
        totalCount,
    }
}