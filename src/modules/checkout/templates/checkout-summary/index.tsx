import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import BulkDiscountBanner from "@modules/common/components/bulk-discount-banner"
import TierProgress from "@modules/common/components/tier-progress"
import { getActiveStorePromotion } from "@lib/data/store-promotions"
import FinancingCostDisplay from "./financing-cost-display"

const CheckoutSummary = async ({ cart }: { cart: any }) => {
  const { bulk, promotion } = await getActiveStorePromotion()

  return (
    <div className="sticky top-4 flex flex-col gap-y-4">
      {/* Progreso de la promoción vigente, o banner de mayoreo */}
      {promotion ? (
        <TierProgress
          promotion={promotion}
          items={cart?.items}
          currencyCode={cart?.currency_code ?? "MXN"}
          variant="compact"
        />
      ) : (
        <BulkDiscountBanner cart={cart} variant="compact" bulk={bulk} />
      )}

      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Heading
          level="h2"
          className="text-xl font-semibold text-gray-800 mb-4"
        >
          Tu Carrito
        </Heading>
        <div className="border-t border-gray-100 pt-4">
          <CartTotals totals={cart} bulk={bulk} />
          <FinancingCostDisplay />
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4">
          <ItemsPreviewTemplate cart={cart} promotionActive={!!promotion} />
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
