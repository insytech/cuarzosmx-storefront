'use client'

import { useState } from "react"
import { Heading } from "@medusajs/ui"

export default function ContactTemplate() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Error al enviar el mensaje')
            }

            setSubmitted(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar el mensaje. Por favor intenta de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const whatsappNumbers = [
        { number: "+52 492 127 7919", link: "524921277919" },
        { number: "+52 492 105 4682", link: "524921054682" },
        { number: "+52 492 246 6698", link: "524922466698" },
        { number: "+52 492 129 4044", link: "524921294044" },
    ]

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full bg-main-color py-16 md:py-24 relative overflow-hidden">
                {/* Icono decorativo de contacto */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10">
                    <svg className="w-64 h-64 md:w-96 md:h-96 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div className="absolute left-0 bottom-0 -translate-x-1/3 translate-y-1/4 opacity-5">
                    <svg className="w-48 h-48 md:w-72 md:h-72 text-white" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="content-container max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                    <div className="text-center">
                        <Heading
                            level="h1"
                            className="font-serenity text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        >
                            CONTÁCTANOS
                        </Heading>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Envíanos un mensaje para cualquier duda. Uno de nuestros agentes te contactará dentro de las próximas 24 hrs.
                        </p>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6" />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                        {/* Contact Form */}
                        <div className="order-2 lg:order-1">
                            <h2 className="font-serenity text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                                Envíanos un mensaje
                            </h2>

                            {submitted ? (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-green-800 mb-2">¡Mensaje enviado!</h3>
                                    <p className="text-green-700">Gracias por contactarnos. Te responderemos dentro de las próximas 24-48 horas.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-4 text-main-color hover:underline font-medium"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-color focus:border-main-color transition-colors duration-200"
                                            placeholder="Tu nombre"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-color focus:border-main-color transition-colors duration-200"
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Asunto (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-color focus:border-main-color transition-colors duration-200"
                                            placeholder="¿Sobre qué quieres hablar?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mensaje
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-color focus:border-main-color transition-colors duration-200 resize-none"
                                            placeholder="¿En qué podemos ayudarte?"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-main-color hover:bg-main-color-dark text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Enviar Mensaje
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Map Section */}
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <h2 className="font-serenity text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                                    Nuestra Ubicación
                                </h2>
                                <div className="rounded-2xl overflow-hidden shadow-lg">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.8892089837584!2d-102.57259742474747!3d22.77296987938085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86824e4e3c16dda9%3A0x8c49f55d6c7b5a2c!2sGenaro%20Codina%20764%2C%20Centro%2C%2098000%20Zacatecas%2C%20Zac.%2C%20Mexico!5e0!3m2!1sen!2sus!4v1702152000000!5m2!1sen!2sus"
                                        width="100%"
                                        height="370"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Ubicación de Cuarzos MX - Zacatecas"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="order-1 lg:order-2 space-y-8">

                            {/* WhatsApp Section */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">Atención en Línea</h3>
                                </div>
                                <div className="space-y-2">
                                    {whatsappNumbers.map((item, index) => (
                                        <a
                                            key={index}
                                            href={`https://wa.me/${item.link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors duration-200 group"
                                        >
                                            <span className="text-green-500">MX:</span>
                                            <span className="group-hover:underline">{item.number}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Email Section */}
                            <div className="bg-gradient-to-br from-main-color-light/30 to-main-color-light/50 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-main-color rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">Correo Electrónico</h3>
                                </div>
                                <a
                                    href="mailto:mineralzac@hotmail.com"
                                    className="text-main-color hover:underline font-medium"
                                >
                                    mineralzac@hotmail.com
                                </a>
                            </div>

                            {/* Comprobantes de Pago */}
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">Envío de Comprobantes de Pago</h3>
                                </div>
                                <a
                                    href="https://wa.me/524921076242"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
                                >
                                    <span className="text-amber-500">WhatsApp:</span>
                                    <span className="hover:underline">+52 492 107 6242</span>
                                </a>
                            </div>

                            {/* Horario */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">Horario de Atención</h3>
                                </div>
                                <div className="space-y-1 text-gray-700">
                                    <p><strong>Lunes - Sábado:</strong> 10:00 AM - 6:00 PM</p>
                                    <p><strong>Domingo:</strong> 10:00 AM - 3:00 PM</p>
                                </div>
                            </div>

                            {/* Tienda Física */}
                            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">Tienda Zacatecas</h3>
                                </div>
                                <div className="space-y-3 text-gray-700">
                                    <p>
                                        <strong>Dirección:</strong><br />
                                        Calle Genaro Codina 764<br />
                                        Col. Centro<br />
                                        Zacatecas, Zacatecas. CP 98000
                                    </p>
                                    <a
                                        href="https://wa.me/524922466698"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-rose-600 hover:underline"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        +52 492 246 6698
                                    </a>
                                    <p className="text-sm text-gray-600">
                                        <strong>Horario:</strong> Lunes a sábado 10:00 AM - 6:00 PM / Domingo 10:00 AM - 3:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
