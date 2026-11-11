import { BannerResponse } from "../../../../types/global"
import { fetchBanners } from "@util/banner-api"
import { getActiveStorePromotion } from "@lib/data/store-promotions"
import { getDefaultTopbarMessage } from "@lib/util/store-promotion"

export default async function TopBar() {
    let displayMessage = "20% DE DESCUENTO POR LA COMPRA DE MÁS DE 12 PRODUCTOS"

    const { promotion } = await getActiveStorePromotion()

    if (promotion) {
        // Promoción por monto vigente: su mensaje reemplaza al del admin (S10)
        displayMessage =
            promotion.topbar_message ?? getDefaultTopbarMessage(promotion)
    } else {
        try {
            const response: BannerResponse = await fetchBanners()
            if (response.promotionMessage?.message) {
                displayMessage = response.promotionMessage.message
            }
        } catch (err) {
            console.error("Error loading promotion message:", err)
        }
    }

    return (
        <div
            data-testid="top-bar"
            data-season={promotion ? "promotion" : undefined}
            className={`w-full ${promotion ? "bg-[#DC3545]" : "bg-main-color"} text-white text-center text-[10px] sm:text-xs py-1.5 sm:py-2 font-semibold flex justify-between items-center px-3 sm:px-8`}>
            <span className="truncate flex-1 mr-2">{displayMessage}</span>
            <div className="flex gap-3 sm:gap-4 flex-shrink-0">
                <a href="https://www.instagram.com/cuarzosmx_oficial/" className="hover:opacity-80" target="_blank" rel="noopener noreferrer">
                    {/* Instagram icon */}
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="17" cy="7" r="1" />
                    </svg>
                </a>
                <a href="https://www.facebook.com/cuarzosmx" className="hover:opacity-80" target="_blank" rel="noopener noreferrer">
                    {/* Facebook icon */}
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S259.5 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z" />
                    </svg>
                </a>
            </div>
        </div>
    )
}
