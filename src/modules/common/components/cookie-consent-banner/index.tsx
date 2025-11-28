"use client"

import { useState } from "react"
import { useCookieConsent, CookiePreferences } from "@lib/context/cookie-consent-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CookieCategory = {
    key: keyof CookiePreferences
    title: string
    description: string
    required: boolean
}

const cookieCategories: CookieCategory[] = [
    {
        key: "necessary",
        title: "Cookies Necesarias",
        description: "Estas cookies son esenciales para el funcionamiento del sitio web. Permiten funciones básicas como la navegación, el carrito de compras y el proceso de pago. No se pueden desactivar.",
        required: true,
    },
    {
        key: "functional",
        title: "Cookies Funcionales",
        description: "Permiten recordar tus preferencias y personalizar tu experiencia, como el idioma seleccionado o la región de envío.",
        required: false,
    },
    {
        key: "analytics",
        title: "Cookies de Análisis",
        description: "Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, permitiéndonos mejorar la experiencia de usuario y nuestros servicios.",
        required: false,
    },
    {
        key: "marketing",
        title: "Cookies de Marketing",
        description: "Se utilizan para mostrar anuncios relevantes y medir la efectividad de nuestras campañas publicitarias.",
        required: false,
    },
]

export default function CookieConsentBanner() {
    const {
        preferences,
        showBanner,
        updatePreferences,
        acceptAll,
        rejectAll,
        savePreferences,
        closeBanner,
        isConsentGiven,
    } = useCookieConsent()

    const [showDetails, setShowDetails] = useState(false)

    if (!showBanner) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
                onClick={isConsentGiven ? closeBanner : undefined}
            />

            {/* Banner Principal */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-main-color to-main-color-dark p-4 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-white">
                                    🍪 Configuración de Cookies
                                </h2>
                                <p className="text-white/80 text-sm">
                                    Tu privacidad es importante para nosotros
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                            Utilizamos cookies para mejorar tu experiencia de navegación, personalizar contenido y analizar nuestro tráfico.
                            Puedes aceptar todas las cookies, rechazar las no esenciales, o personalizar tus preferencias.
                        </p>

                        {/* Toggle Details Button */}
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 text-main-color hover:text-main-color-dark text-sm font-medium mb-4 transition-colors"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            {showDetails ? "Ocultar opciones" : "Personalizar preferencias"}
                        </button>

                        {/* Detailed Options */}
                        {showDetails && (
                            <div className="space-y-3 mb-6 border-t border-gray-100 pt-4">
                                {cookieCategories.map((category) => (
                                    <div
                                        key={category.key}
                                        className="flex items-start gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-shrink-0 pt-0.5">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={preferences[category.key]}
                                                    disabled={category.required}
                                                    onChange={(e) =>
                                                        updatePreferences({ [category.key]: e.target.checked })
                                                    }
                                                />
                                                <div className={`
                                                    w-11 h-6 rounded-full peer 
                                                    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-main-color/20
                                                    ${category.required
                                                        ? "bg-main-color cursor-not-allowed"
                                                        : "bg-gray-300 peer-checked:bg-main-color"
                                                    }
                                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                    after:bg-white after:rounded-full after:h-5 after:w-5 
                                                    after:transition-all peer-checked:after:translate-x-full
                                                    transition-colors duration-200
                                                `} />
                                            </label>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    {category.title}
                                                </h3>
                                                {category.required && (
                                                    <span className="text-xs bg-main-color/10 text-main-color px-2 py-0.5 rounded-full">
                                                        Requeridas
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={rejectAll}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                            >
                                Solo necesarias
                            </button>

                            {showDetails && (
                                <button
                                    onClick={savePreferences}
                                    className="flex-1 px-4 py-3 border border-main-color text-main-color rounded-xl font-medium hover:bg-main-color/5 transition-colors text-sm sm:text-base"
                                >
                                    Guardar preferencias
                                </button>
                            )}

                            <button
                                onClick={acceptAll}
                                className="flex-1 px-4 py-3 bg-main-color text-white rounded-xl font-medium hover:bg-main-color-dark transition-colors text-sm sm:text-base"
                            >
                                Aceptar todas
                            </button>
                        </div>

                        {/* Policy Link */}
                        <p className="text-center text-gray-500 text-xs mt-4">
                            Para más información, consulta nuestra{" "}
                            <LocalizedClientLink
                                href="/cookies"
                                className="text-main-color hover:underline"
                            >
                                Política de Cookies
                            </LocalizedClientLink>
                            {" "}y{" "}
                            <LocalizedClientLink
                                href="/privacy"
                                className="text-main-color hover:underline"
                            >
                                Aviso de Privacidad
                            </LocalizedClientLink>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
