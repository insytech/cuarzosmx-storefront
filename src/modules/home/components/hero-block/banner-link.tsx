"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Dominios internos de la aplicación
const INTERNAL_DOMAINS = [
    'localhost',
    'cuarzosmx.com',
    'www.cuarzosmx.com',
    'cuarzos.mx',
    'www.cuarzos.mx'
]

// Función para procesar la URL del banner
const processUrl = (url: string): { href: string; isExternal: boolean } => {
    if (!url || url === '#') {
        return { href: '/store', isExternal: false }
    }

    // Si es ruta relativa (empieza con /), es interna
    if (url.startsWith('/')) {
        return { href: url, isExternal: false }
    }

    try {
        const urlObj = new URL(url)
        const hostname = urlObj.hostname.toLowerCase()

        // Verificar si es un dominio interno
        const isInternalDomain = INTERNAL_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith(`.${domain}`)
        )

        if (isInternalDomain) {
            // Extraer solo el pathname (sin el prefijo de país como /mx)
            let path = urlObj.pathname

            // Remover prefijo de país si existe (/mx, /us, etc.)
            const countryPrefixMatch = path.match(/^\/[a-z]{2}(\/.*)?$/)
            if (countryPrefixMatch) {
                path = countryPrefixMatch[1] || '/'
            }

            return { href: path || '/', isExternal: false }
        }

        // Es URL externa
        return { href: url, isExternal: true }
    } catch {
        // Si no se puede parsear como URL, tratarla como ruta relativa
        return { href: url.startsWith('/') ? url : `/${url}`, isExternal: false }
    }
}

// Componente helper para manejar links internos y externos
export default function BannerLink({
    href,
    children,
    className
}: {
    href: string
    children: React.ReactNode
    className?: string
}) {
    const { href: processedHref, isExternal } = processUrl(href)

    // Si es URL externa, usa <a> con target="_blank"
    if (isExternal) {
        return (
            <a
                href={processedHref}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
            >
                {children}
            </a>
        )
    }

    // Si es ruta interna, usa LocalizedClientLink
    return (
        <LocalizedClientLink href={processedHref} className={className}>
            {children}
        </LocalizedClientLink>
    )
}
