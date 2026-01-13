"use client"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CookieSettingsButton from "@modules/common/components/cookie-settings-button"

type SectionProps = {
    title: string
    children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
    return (
        <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-main-color rounded-full" />
                {title}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 pl-5">
                {children}
            </div>
        </div>
    )
}

type CookieRowProps = {
    name: string
    provider: string
    purpose: string
    duration: string
    type: "Necesaria" | "Funcional" | "Analítica" | "Marketing"
}

function CookieRow({ name, provider, purpose, duration, type }: CookieRowProps) {
    const typeColors = {
        Necesaria: "bg-green-100 text-green-800",
        Funcional: "bg-blue-100 text-blue-800",
        Analítica: "bg-yellow-100 text-yellow-800",
        Marketing: "bg-purple-100 text-purple-800",
    }

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 font-mono text-sm text-gray-800">{name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{provider}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{purpose}</td>
            <td className="px-4 py-3 text-sm text-gray-500">{duration}</td>
            <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type]}`}>
                    {type}
                </span>
            </td>
        </tr>
    )
}

export default function CookiesPolicyTemplate() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full bg-main-color py-16 md:py-24 relative overflow-hidden">
                {/* Icono decorativo de cookie */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10">
                    <svg className="w-64 h-64 md:w-96 md:h-96 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                </div>
                <div className="absolute left-0 bottom-0 -translate-x-1/3 translate-y-1/4 opacity-5">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                    <div className="text-center">
                        <Heading
                            level="h1"
                            className="font-serenity text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        >
                            🍪 POLÍTICA DE COOKIES
                        </Heading>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Información sobre el uso de cookies y tecnologías similares
                        </p>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6" />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-4xl mx-auto px-4 lg:px-8">

                    {/* Fecha de actualización */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-8 text-center">
                        <p className="text-sm text-gray-600">
                            Última actualización: <strong>Noviembre 2025</strong>
                        </p>
                    </div>

                    {/* CTA para cambiar preferencias */}
                    <div className="bg-main-color-light/30 border border-main-color/20 rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">¿Quieres cambiar tus preferencias?</h3>
                            <p className="text-gray-600 text-sm">Puedes modificar tu configuración de cookies en cualquier momento.</p>
                        </div>
                        <CookieSettingsButton />
                    </div>

                    <Section title="¿Qué son las Cookies?">
                        <p>
                            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil)
                            cuando visitas un sitio web. Estas cookies permiten que el sitio web recuerde tus acciones y preferencias
                            durante un período de tiempo, para que no tengas que volver a introducirlas cada vez que visites el sitio
                            o navegues de una página a otra.
                        </p>
                        <p>
                            En <strong>CuarzosMX</strong> utilizamos cookies y tecnologías similares para mejorar tu experiencia de
                            navegación, recordar tus preferencias y entender cómo utilizas nuestro sitio.
                        </p>
                    </Section>

                    <Section title="Tipos de Cookies que Utilizamos">
                        <div className="space-y-6">
                            {/* Necesarias */}
                            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-green-800">Cookies Necesarias</h4>
                                        <span className="text-xs text-green-600">Siempre activas</span>
                                    </div>
                                </div>
                                <p className="text-green-900 text-sm">
                                    Son esenciales para el funcionamiento básico del sitio web. Permiten navegar por la página,
                                    utilizar el carrito de compras, iniciar sesión y completar el proceso de pago.
                                    Sin estas cookies, el sitio web no funcionaría correctamente.
                                </p>
                            </div>

                            {/* Funcionales */}
                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-blue-800">Cookies Funcionales</h4>
                                </div>
                                <p className="text-blue-900 text-sm">
                                    Permiten recordar tus preferencias y personalizar tu experiencia. Por ejemplo,
                                    recuerdan tu región de envío, idioma preferido o si ya has visto ciertos mensajes.
                                </p>
                            </div>

                            {/* Analíticas */}
                            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-yellow-800">Cookies de Análisis</h4>
                                </div>
                                <p className="text-yellow-900 text-sm">
                                    Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                                    Recopilan información de forma anónima sobre las páginas visitadas, tiempo de permanencia
                                    y posibles errores. Utilizamos esta información para mejorar nuestro sitio.
                                </p>
                            </div>

                            {/* Marketing */}
                            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-purple-800">Cookies de Marketing</h4>
                                </div>
                                <p className="text-purple-900 text-sm">
                                    Se utilizan para rastrear a los visitantes en los sitios web y mostrar anuncios relevantes.
                                    También ayudan a medir la efectividad de nuestras campañas publicitarias.
                                </p>
                            </div>
                        </div>
                    </Section>

                    <Section title="Detalle de Cookies Utilizadas">
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Nombre</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Proveedor</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Propósito</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Duración</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <CookieRow
                                        name="cuarzosmx_cookie_consent"
                                        provider="CuarzosMX"
                                        purpose="Almacena el consentimiento de cookies del usuario"
                                        duration="1 año"
                                        type="Necesaria"
                                    />
                                    <CookieRow
                                        name="cuarzosmx_cookie_preferences"
                                        provider="CuarzosMX"
                                        purpose="Almacena las preferencias de cookies seleccionadas"
                                        duration="1 año"
                                        type="Necesaria"
                                    />
                                    <CookieRow
                                        name="_medusa_cart_id"
                                        provider="Medusa"
                                        purpose="Identifica el carrito de compras del usuario"
                                        duration="Sesión"
                                        type="Necesaria"
                                    />
                                    <CookieRow
                                        name="_medusa_region"
                                        provider="Medusa"
                                        purpose="Almacena la región seleccionada para envíos"
                                        duration="1 año"
                                        type="Funcional"
                                    />
                                    <CookieRow
                                        name="_ga"
                                        provider="Google Analytics"
                                        purpose="Distingue usuarios únicos asignando un ID"
                                        duration="2 años"
                                        type="Analítica"
                                    />
                                    <CookieRow
                                        name="_ga_*"
                                        provider="Google Analytics"
                                        purpose="Mantiene el estado de la sesión"
                                        duration="2 años"
                                        type="Analítica"
                                    />
                                    <CookieRow
                                        name="_fbp"
                                        provider="Meta (Facebook)"
                                        purpose="Seguimiento de visitas para publicidad"
                                        duration="3 meses"
                                        type="Marketing"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="¿Cómo Gestionar las Cookies?">
                        <p>
                            Puedes gestionar tus preferencias de cookies de varias formas:
                        </p>

                        <div className="mt-4 space-y-4">
                            <div className="bg-main-color-light/20 rounded-xl p-4 border border-main-color/10">
                                <h4 className="font-semibold text-gray-800 mb-2">1. Desde nuestro sitio web</h4>
                                <p className="text-gray-600 text-sm mb-3">
                                    Utiliza el botón de configuración de cookies que aparece en esta página o en el
                                    banner de cookies para modificar tus preferencias en cualquier momento.
                                </p>
                                <CookieSettingsButton variant="small" />
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-800 mb-2">2. Desde tu navegador</h4>
                                <p className="text-gray-600 text-sm">
                                    Puedes configurar tu navegador para que rechace todas las cookies o te avise cuando se envía una.
                                    Ten en cuenta que si rechazas todas las cookies, algunas funciones del sitio podrían no funcionar correctamente.
                                </p>
                                <ul className="mt-3 space-y-2 text-sm">
                                    <li>
                                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-main-color hover:underline">
                                            → Google Chrome
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-main-color hover:underline">
                                            → Mozilla Firefox
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.apple.com/es-mx/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-main-color hover:underline">
                                            → Safari
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.microsoft.com/es-mx/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-main-color hover:underline">
                                            → Microsoft Edge
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Section>

                    <Section title="Actualizaciones de esta Política">
                        <p>
                            Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en las cookies
                            que utilizamos o por otras razones operativas, legales o regulatorias. Te recomendamos revisar
                            esta página regularmente para estar informado sobre nuestro uso de cookies.
                        </p>
                    </Section>

                    <Section title="Contacto">
                        <p>
                            Si tienes alguna pregunta sobre nuestra Política de Cookies, puedes contactarnos a través de:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>
                                Correo electrónico:{" "}
                                <a href="mailto:mineralzac@hotmail.com" className="text-main-color hover:underline">
                                    mineralzac@hotmail.com
                                </a>
                            </li>
                            <li>
                                WhatsApp:{" "}
                                <a href="https://wa.me/524921277919" className="text-main-color hover:underline">
                                    +52 492 127 7919
                                </a>
                            </li>
                        </ul>
                    </Section>

                    {/* Enlaces relacionados */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4">Documentos Relacionados</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <LocalizedClientLink
                                href="/privacy"
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-main-color/10 rounded-full flex items-center justify-center group-hover:bg-main-color/20 transition-colors">
                                    <svg className="w-5 h-5 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Aviso de Privacidad</span>
                                    <p className="text-sm text-gray-500">Tratamiento de datos personales</p>
                                </div>
                            </LocalizedClientLink>

                            <LocalizedClientLink
                                href="/terms"
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-main-color/10 rounded-full flex items-center justify-center group-hover:bg-main-color/20 transition-colors">
                                    <svg className="w-5 h-5 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Términos y Condiciones</span>
                                    <p className="text-sm text-gray-500">Condiciones de uso del sitio</p>
                                </div>
                            </LocalizedClientLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
