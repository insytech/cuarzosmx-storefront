import { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogPost from "@modules/blog/components/blog-post"
import { useBlogPost } from "@hooks/use-blog-post"
import { blogApi } from "@util/blog-api"

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params

    try {
        const response = await blogApi.getPost(slug)
        const post = response.post

        return {
            title: post.seo_title || post.title,
            description: post.seo_description || `Lee nuestro artículo: ${post.title}`,
            openGraph: {
                title: post.seo_title || post.title,
                description: post.seo_description || `Lee nuestro artículo: ${post.title}`,
                images: post.thumbnail_url ? [{ url: post.thumbnail_url }] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.seo_title || post.title,
                description: post.seo_description || `Lee nuestro artículo: ${post.title}`,
                images: post.thumbnail_url ? [post.thumbnail_url] : [],
            },
        }
    } catch (error) {
        return {
            title: "Post no encontrado | Cuarzos MX",
            description: "El artículo solicitado no fue encontrado.",
        }
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params

    return <BlogPostPageClient slug={slug} />
}

function BlogPostPageClient({ slug }: { slug: string }) {
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