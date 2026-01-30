"use client"

import { CookieConsentProvider } from "@lib/context/cookie-consent-context"
import CookieConsentBanner from "@modules/common/components/cookie-consent-banner"

export default function CookieConsentWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CookieConsentProvider>
            {children}
            <CookieConsentBanner />
        </CookieConsentProvider>
    )
}
