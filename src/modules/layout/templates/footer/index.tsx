'use client'
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useState } from "react"
import clx from "clsx"

type Collection = {
  id: string
  handle: string
  title: string
}

export default function Footer() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [openSection, setOpenSection] = useState<string | null>(null)

  useEffect(() => {
    setCollections([
      { id: "1", handle: "cuarzos-naturales", title: "Cuarzos Naturales" },
      { id: "2", handle: "cuarzos-rosas", title: "Cuarzos Rosas" },
      { id: "3", handle: "cuarzos-amatista", title: "Cuarzos Amatista" },
      { id: "4", handle: "cuarzos-citrine", title: "Cuarzos Citrine" },
    ])
  }, [])

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="w-full bg-main-color text-white">
      {/* Main Content */}
      <div className="content-container max-w-7xl mx-auto px-4 lg:px-8">
        <div className="py-10 sm:py-12 lg:py-16 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">

            {/* Logo & Social Links Section - Always visible */}
            <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-6 pb-6 lg:pb-0 border-b lg:border-b-0 border-white/10">
              <LocalizedClientLink
                href="/"
                className="hover:opacity-85 transition-opacity"
              >
                <img
                  src="/IMAGOTIPO 2 BLANCO.webp"
                  alt="CuarzosMX Logo"
                  className="w-28 sm:w-32 lg:w-36"
                />
              </LocalizedClientLink>

              {/* Social Links */}
              <div className="flex gap-3 sm:gap-1">
                <a
                  href="https://www.facebook.com/cuarzosmx"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Síguenos en Facebook"
                  className="group"
                >
                  <div className="p-2.5 sm:p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 320 512">
                      <path d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S259.5 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z" />
                    </svg>
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/cuarzosmx_oficial/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Síguenos en Instagram"
                  className="group"
                >
                  <div className="p-2.5 sm:p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="17" cy="7" r="1" />
                    </svg>
                  </div>
                </a>
                <a
                  href="https://wa.me/524928690537"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Contáctanos por WhatsApp"
                  className="group"
                >
                  <div className="p-2.5 sm:p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                </a>
                <a
                  href="https://www.youtube.com/@claudiacuarzos9781"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Suscríbete a nuestro canal de YouTube"
                  className="group"
                >
                  <div className="p-2.5 sm:p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                </a>
              </div>

              {/* Mobile: Quick contact info */}
              <div className="lg:hidden text-center text-sm text-white/80">
                <p>¿Dudas? Escríbenos</p>
                <a href="mailto:ventas@cuarzos.mx" className="text-white hover:underline">
                  ventas@cuarzos.mx
                </a>
              </div>
            </div>

            {/* Mobile Accordion / Desktop Grid sections */}
            <div className="lg:contents">
              {/* Videoteca Section */}
              <div className="border-b lg:border-b-0 border-white/10 pb-4 lg:pb-0">
                <button
                  onClick={() => toggleSection('videoteca')}
                  className="lg:pointer-events-none w-full flex items-center justify-between py-2 lg:py-0"
                >
                  <span className="text-sm font-bold uppercase tracking-wide">Videoteca</span>
                  <svg
                    className={clx(
                      "w-5 h-5 lg:hidden transition-transform duration-200",
                      openSection === 'videoteca' ? "rotate-180" : ""
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={clx(
                  "overflow-hidden transition-all duration-300 lg:overflow-visible lg:max-h-none lg:mt-4",
                  openSection === 'videoteca' ? "max-h-60 mt-3" : "max-h-0 lg:max-h-none"
                )}>
                  <ul className="space-y-2.5 lg:space-y-3 text-sm text-white/80">
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=P-p6qhlm70s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200 flex items-start gap-2"
                      >
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Como limpio y programo un cuarzo</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=aqXx2YeXhdY&t=1s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200 flex items-start gap-2"
                      >
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Poderosa energía de los cuarzos</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=7OwjtoggbHE&t=2s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200 flex items-start gap-2"
                      >
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Como uso los cuarzos en mi casa</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=uAbZB6m_w0s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200 flex items-start gap-2"
                      >
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Como uso los cuarzos a mi favor</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* La empresa Section */}
              <div className="border-b lg:border-b-0 border-white/10 pb-4 lg:pb-0">
                <button
                  onClick={() => toggleSection('empresa')}
                  className="lg:pointer-events-none w-full flex items-center justify-between py-2 lg:py-0"
                >
                  <span className="text-sm font-bold uppercase tracking-wide">La Empresa</span>
                  <svg
                    className={clx(
                      "w-5 h-5 lg:hidden transition-transform duration-200",
                      openSection === 'empresa' ? "rotate-180" : ""
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={clx(
                  "overflow-hidden transition-all duration-300 lg:overflow-visible lg:max-h-none lg:mt-4",
                  openSection === 'empresa' ? "max-h-48 mt-3" : "max-h-0 lg:max-h-none"
                )}>
                  <ul className="space-y-2.5 lg:space-y-3 text-sm text-white/80">
                    <li>
                      <LocalizedClientLink
                        href="/store"
                        className="hover:text-white transition-colors duration-200"
                      >
                        Catálogo
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/contact"
                        className="hover:text-white transition-colors duration-200"
                      >
                        Contáctanos
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/about"
                        className="hover:text-white transition-colors duration-200"
                      >
                        Nosotros
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/faq"
                        className="hover:text-white transition-colors duration-200"
                      >
                        Preguntas Frecuentes
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/blog"
                        className="hover:text-white transition-colors duration-200"
                      >
                        Blog
                      </LocalizedClientLink>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CuarzosMX Section */}
              <div className="pb-2 lg:pb-0">
                <button
                  onClick={() => toggleSection('cuarzos')}
                  className="lg:pointer-events-none w-full flex items-center justify-between py-2 lg:py-0"
                >
                  <span className="text-sm font-bold uppercase tracking-wide">Cuarzos.mx</span>
                  <svg
                    className={clx(
                      "w-5 h-5 lg:hidden transition-transform duration-200",
                      openSection === 'cuarzos' ? "rotate-180" : ""
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={clx(
                  "overflow-hidden transition-all duration-300 lg:overflow-visible lg:max-h-none lg:mt-4",
                  openSection === 'cuarzos' ? "max-h-40 mt-3" : "max-h-0 lg:max-h-none"
                )}>
                  <p className="text-sm leading-relaxed text-white/85 font-light mb-4">
                    Somos una tienda especializada en la venta de cuarzos desde hace más de 20 años.
                  </p>
                  <LocalizedClientLink
                    href="/terms"
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm underline underline-offset-2"
                  >
                    Términos y Condiciones
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

