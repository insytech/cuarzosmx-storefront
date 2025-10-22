"use client"

import { useState, useEffect } from 'react'
import { useBlogPost } from '@hooks/use-blog-post'
import BlogPost from '@modules/blog/components/blog-post'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    return <BlogPostPageClient params={params} />
}

function BlogPostPageClient({ params }: BlogPostPageProps) {
    const [slug, setSlug] = useState<string>('')

    useEffect(() => {
        params.then(resolved => setSlug(resolved.slug))
    }, [params])

    const { post, isLoading, error } = useBlogPost(slug)

    if (error === 'Post not found') {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <BlogPost
                post={post}
                isLoading={isLoading}
                error={error || undefined}
            />
        </div>
    )
}