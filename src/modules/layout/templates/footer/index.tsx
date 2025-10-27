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

  useEffect(() => {
    setCollections([
      { id: "1", handle: "cuarzos-naturales", title: "Cuarzos Naturales" },
      { id: "2", handle: "cuarzos-rosas", title: "Cuarzos Rosas" },
      { id: "3", handle: "cuarzos-amatista", title: "Cuarzos Amatista" },
      { id: "4", handle: "cuarzos-citrine", title: "Cuarzos Citrine" },
    ])
  }, [])

  return (
    <footer className="w-full bg-main-color text-white">
      {/* Main Content */}
      <div className="content-container max-w-7xl mx-auto px-4 lg:px-8">
        <div className="py-12 small:py-16 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Logo & Social Links Section */}
            <div className="flex flex-col gap-6">
              <LocalizedClientLink
                href="/"
                className="hover:opacity-85 transition-opacity w-fit"
              >
                <img
                  src="/Logo-Cuarzos.webp"
                  alt="CuarzosMX Logo"
                  className="w-32"

                />
              </LocalizedClientLink>

              {/* Social Links */}
              <div className="flex gap-4 pt-2">
                <a
                  href="https://www.facebook.com/cuarzosmx"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Síguenos en Facebook"
                  className="group"
                >
                  <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 320 512">
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
                  <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200 group-hover:scale-110">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="17" cy="7" r="1" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            {/* Videoteca Section */}
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <a
                  href="https://www.youtube.com/@claudiacuarzos9781/videos"
                  className="txt-small-plus txt-ui-fg-base font-bold"
                >
                  VIDEOTECA
                </a>
              </div>
              <ul className="space-y-3 text-xs small:text-sm text-white/80 txt-small">
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=P-p6qhlm70s"
                    className="hover:text-white transition-colors duration-200"
                  >
                    *Como limpio y programo un cuarzo
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=aqXx2YeXhdY&t=1s"
                    className="hover:text-white transition-colors duration-200"
                  >
                    *Poderosa energía de los cuarzos para protegerte
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=7OwjtoggbHE&t=2s"
                    className="hover:text-white transition-colors duration-200"
                  >
                    *Como uso los cuarzos en mi casa
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=uAbZB6m_w0s"
                    className="hover:text-white transition-colors duration-200"
                  >
                    *Como uso los cuarzos a mi favor
                  </a>
                </li>
              </ul>
            </div>

            {/* La empresa Section */}
            <div className="flex flex-col gap-y-2">
              <div className="text-center">
                <span className="txt-small-plus txt-ui-fg-base font-bold">
                  LA EMPRESA
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-y-2 text-white/80 txt-small">
                <li>
                  <a
                    href="/store"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Catálogo
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=uAbZB6m_w0s"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contactanos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Preguntas Frecuentes
                  </a>
                </li>
              </ul>
            </div>

            {/* CuarzosMX Section */}
            <div className="flex flex-col gap-y-2">
              <div className="text-center">
                <span className="txt-small-plus txt-ui-fg-base font-bold">
                  CUARZOS.MX
                </span>
              </div>
              <p className="text-xs small:text-sm leading-relaxed text-white/85 font-light">
                Somos una tienda especializada en la venta de cuarzos desde hace más de 20 años.
              </p>
              <div className="text-center">
                <LocalizedClientLink href="/terms" className="text-white/80 hover:text-white transition-colors duration-200 text-xs small:text-sm">
                  Política de devoluciones y reembolsos
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div >
      </div>
    </footer >
  )
}

