"use client"

import { useEffect } from "react"
import { useCookieConsent } from "@lib/context/cookie-consent-context"

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function GoogleTagManager() {
  const { preferences, isConsentGiven } = useCookieConsent()

  useEffect(() => {
    if (!GTM_ID || !isConsentGiven) return

    // Set default consent to denied
    window.dataLayer = window.dataLayer || []
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }

    // Consent Mode v2 defaults
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "denied",
    })

    // Update consent based on user preferences
    gtag("consent", "update", {
      analytics_storage: preferences.analytics ? "granted" : "denied",
      ad_storage: preferences.marketing ? "granted" : "denied",
      ad_user_data: preferences.marketing ? "granted" : "denied",
      ad_personalization: preferences.marketing ? "granted" : "denied",
      functionality_storage: preferences.functional ? "granted" : "denied",
    })

    // Load GTM script if not already loaded
    if (!document.getElementById("gtm-script")) {
      const script = document.createElement("script")
      script.id = "gtm-script"
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
      document.head.appendChild(script)

      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      })
    }

    // Load GA4 script if not already loaded and analytics is accepted
    if (GA_ID && preferences.analytics && !document.getElementById("ga-script")) {
      const gaScript = document.createElement("script")
      gaScript.id = "ga-script"
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(gaScript)

      gtag("js", new Date())
      gtag("config", GA_ID)
    }
  }, [isConsentGiven, preferences])

  return null
}

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}
