import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function TopBar() {
    return (
        <div className="w-full bg-main-color text-white text-center text-xs py-2 font-semibold flex justify-between items-center px-8">
            <span>20% DE DESCUENTO POR LA COMPRA DE MÁS DE 12 PRODUCTOS</span>
            <div className="flex gap-4">
                <a href="https://www.instagram.com/cuarzosmx_oficial/" className="hover:opacity-80" target="_blank" rel="noopener noreferrer">
                    {/* Instagram icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="17" cy="7" r="1" />
                    </svg>
                </a>
                <a href="https://www.facebook.com/cuarzosmx" className="hover:opacity-80" target="_blank" rel="noopener noreferrer">
                    {/* Facebook icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S259.5 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z" />
                    </svg>
                </a>
            </div>
        </div>
    )
}