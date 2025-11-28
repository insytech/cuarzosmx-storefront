"use client"

import { CookieConsentProvider } from "@lib/context/cookie-consent-context"
import dynamic from "next/dynamic"

// Cargar el banner dinámicamente para evitar problemas de SSR con el contexto
const CookieConsentBanner = dynamic(
    () => import("@modules/common/components/cookie-consent-banner"),
    { ssr: false }
)

export default function CookieConsentWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CookieConsentProvider>
            {children}
            <CookieConsentBanner />
        </CookieConsentProvider>
    )
}
