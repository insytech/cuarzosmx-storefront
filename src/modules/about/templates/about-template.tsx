'use client'

import { Heading } from "@medusajs/ui"

export default function AboutTemplate() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full bg-main-color py-16 md:py-24">
                <div className="content-container max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center">
                        <Heading
                            level="h1"
                            className="font-serenity text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        >
                            NOSOTROS
                        </Heading>
                        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full" />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="w-full py-16 md:py-20 bg-white">
                <div className="content-container max-w-4xl mx-auto px-4 lg:px-8">
                    <div className="space-y-8">
                        {/* Intro */}
                        <div className="text-center mb-12">
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                <span className="font-bold text-main-color">Cuarzos.MX</span> es una empresa mexicana fundada por mineros en la bella ciudad de <span className="font-semibold">Zacatecas</span> desde hace más de <span className="font-semibold">20 años</span>.
                            </p>
                        </div>

                        {/* Content Cards */}
                        <div className="grid gap-8">
                            {/* Card 1 - Quiénes somos */}
                            <div className="bg-gradient-to-r from-main-color-light/30 to-white p-8 rounded-2xl border border-main-color-light">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-main-color rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-800 mb-3">Especialistas en el sector</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Nos posicionamos en el mercado como una empresa especializada en la venta de <strong>cuarzos decorativos</strong>, <strong>especímenes de colección</strong>, <strong>fósiles</strong>, <strong>artículos holísticos</strong>, <strong>artesanías</strong> y <strong>joyería en cuarzos</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 - Misión */}
                            <div className="bg-gradient-to-r from-white to-main-color-light/30 p-8 rounded-2xl border border-main-color-light">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-main-color rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-800 mb-3">Nuestra Misión</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Ofrecer <strong>calidad</strong> en nuestros productos, cuarzos <strong>100% originales</strong>, <strong>precios competitivos</strong> de acuerdo al mercado y una <strong>amplia variedad</strong> de artículos.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 - Ventas */}
                            <div className="bg-gradient-to-r from-main-color-light/30 to-white p-8 rounded-2xl border border-main-color-light">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-main-color rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-800 mb-3">Mayoreo y Menudeo</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Somos especializados en ventas al <strong>mayoreo</strong>, así como <strong>menudeo</strong>. Día a día Cuarzos.MX se consolida como una referencia en este sector, siempre en busca de crecimiento.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 - Evolución */}
                            <div className="bg-gradient-to-r from-white to-main-color-light/30 p-8 rounded-2xl border border-main-color-light">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-main-color rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-800 mb-3">Evolución Constante</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Orgullosamente hemos evolucionado adaptándonos con las nuevas demandas del mercado. Trabajamos con <strong>órdenes en línea</strong>, <strong>atención personalizada</strong> y <strong>envíos a toda la República mexicana y Estados Unidos</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Commitment Banner */}
                        <div className="mt-12 bg-main-color rounded-2xl p-8 md:p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="font-serenity text-2xl md:text-3xl font-bold text-white mb-4">
                                Nuestro Compromiso
                            </h3>
                            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                                Brindar la <strong className="text-white">mejor atención</strong> y <strong className="text-white">satisfacción</strong> a nuestros clientes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
