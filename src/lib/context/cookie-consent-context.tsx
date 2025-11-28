"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export type CookiePreferences = {
    necessary: boolean      // Siempre true - requeridas para el funcionamiento
    analytics: boolean      // Google Analytics, etc.
    marketing: boolean      // Publicidad, remarketing
    functional: boolean     // Preferencias, idioma, etc.
}

type CookieConsentContextType = {
    preferences: CookiePreferences
    isConsentGiven: boolean
    showBanner: boolean
    updatePreferences: (preferences: Partial<CookiePreferences>) => void
    acceptAll: () => void
    rejectAll: () => void
    savePreferences: () => void
    openSettings: () => void
    closeBanner: () => void
}

const defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
}

const COOKIE_CONSENT_KEY = "cuarzosmx_cookie_consent"
const COOKIE_PREFERENCES_KEY = "cuarzosmx_cookie_preferences"

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)
    const [isConsentGiven, setIsConsentGiven] = useState(false)
    const [showBanner, setShowBanner] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Cargar preferencias del localStorage al montar
    useEffect(() => {
        const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
        const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)

        if (savedConsent === "true" && savedPreferences) {
            try {
                const parsed = JSON.parse(savedPreferences) as CookiePreferences
                setPreferences({ ...parsed, necessary: true }) // Necessary siempre true
                setIsConsentGiven(true)
                setShowBanner(false)
            } catch {
                setShowBanner(true)
            }
        } else {
            // No hay consentimiento previo, mostrar banner
            setShowBanner(true)
        }
        setIsLoaded(true)
    }, [])

    const saveToStorage = useCallback((prefs: CookiePreferences) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "true")
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
    }, [])

    const updatePreferences = useCallback((newPrefs: Partial<CookiePreferences>) => {
        setPreferences(prev => ({
            ...prev,
            ...newPrefs,
            necessary: true, // Siempre mantener necessary en true
        }))
    }, [])

    const acceptAll = useCallback(() => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
        }
        setPreferences(allAccepted)
        saveToStorage(allAccepted)
        setIsConsentGiven(true)
        setShowBanner(false)
    }, [saveToStorage])

    const rejectAll = useCallback(() => {
        const onlyNecessary: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
        }
        setPreferences(onlyNecessary)
        saveToStorage(onlyNecessary)
        setIsConsentGiven(true)
        setShowBanner(false)
    }, [saveToStorage])

    const savePreferences = useCallback(() => {
        saveToStorage(preferences)
        setIsConsentGiven(true)
        setShowBanner(false)
    }, [preferences, saveToStorage])

    const openSettings = useCallback(() => {
        setShowBanner(true)
    }, [])

    const closeBanner = useCallback(() => {
        if (isConsentGiven) {
            setShowBanner(false)
        }
    }, [isConsentGiven])

    // No renderizar nada hasta que se carguen las preferencias
    if (!isLoaded) {
        return <>{children}</>
    }

    return (
        <CookieConsentContext.Provider
            value={{
                preferences,
                isConsentGiven,
                showBanner,
                updatePreferences,
                acceptAll,
                rejectAll,
                savePreferences,
                openSettings,
                closeBanner,
            }}
        >
            {children}
        </CookieConsentContext.Provider>
    )
}

export function useCookieConsent() {
    const context = useContext(CookieConsentContext)
    if (context === undefined) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider")
    }
    return context
}
