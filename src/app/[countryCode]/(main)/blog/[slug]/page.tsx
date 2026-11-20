import { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { getBlogPostBySlug, StoreBlogPost } from "@lib/util/blog-api"
import { blogPostSeo } from "@lib/util/blog-seo"
import { OG_IMAGE } from "@lib/util/seo"
import BlogPost from "@modules/blog/components/blog-post"

// ISR: el post se cachea 1 h (mismo valor que el fetch en `getBlogPostBySlug`).
export const revalidate = 3600

type Props = {
    params: Promise<{ countryCode: string; slug: string }>
}

/**
 * Post publicado del slug. Si el slug es una URL anterior del post, redirige
 * con 308 (Google lo trata como 301) al slug actual (S5); si no existe, 404.
 */
async function loadPost(countryCode: string, slug: string): Promise<StoreBlogPost> {
    const result = await getBlogPostBySlug(slug)

    if (!result) {
        notFound()
    }
    if ("redirect" in result) {
        permanentRedirect(`/${countryCode}/blog/${encodeURIComponent(result.redirect)}`)
    }
    return result.post
}

// Server Component: antes la pagina era "use client" y pedia el post en el
// navegador, asi que el HTML del servidor salia con el <title> generico, el
// canonical de la home y sin H1 ni cuerpo (S1-S3).
export async function generateMetadata(props: Props): Promise<Metadata> {
    const { countryCode, slug } = await props.params
    const post = await loadPost(countryCode, slug)
    const seo = blogPostSeo(post, countryCode)

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: {
            canonical: seo.canonical,
        },
        openGraph: {
            type: "article",
            locale: "es_MX",
            siteName: "CuarzosMX",
            title: seo.socialTitle,
            description: seo.description,
            url: seo.canonical,
            publishedTime: post.created_at,
            modifiedTime: post.updated_at,
            images: seo.image
                ? [{ url: seo.image, alt: post.title }]
                : [OG_IMAGE],
        },
        twitter: {
            card: "summary_large_image",
            title: seo.socialTitle,
            description: seo.description,
            images: [seo.image ?? OG_IMAGE.url],
        },
    }
}

export default async function BlogPostPage(props: Props) {
    const { countryCode, slug } = await props.params
    const post = await loadPost(countryCode, slug)

    return (
        <div className="bg-gradient-to-b from-main-color-light/20 to-white min-h-screen">
            {/* Decoración de fondo */}
            <div className="absolute inset-x-0 top-0 h-96 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-main-color/5 rounded-full blur-3xl" />
                <div className="absolute top-20 -left-20 w-60 h-60 bg-main-color-light/50 rounded-full blur-2xl" />
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 relative">
                <BlogPost post={post} />
            </div>
        </div>
    )
}
