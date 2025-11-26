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
        <div className="bg-gradient-to-b from-main-color-light/20 to-white min-h-screen">
            {/* Decoración de fondo */}
            <div className="absolute inset-x-0 top-0 h-96 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-main-color/5 rounded-full blur-3xl" />
                <div className="absolute top-20 -left-20 w-60 h-60 bg-main-color-light/50 rounded-full blur-2xl" />
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 relative">
                <BlogPost
                    post={post}
                    isLoading={isLoading}
                    error={error || undefined}
                />
            </div>
        </div>
    )
}