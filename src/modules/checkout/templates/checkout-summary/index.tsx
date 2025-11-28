import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import FinancingCostDisplay from "./financing-cost-display"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-4 flex flex-col gap-y-4">
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Heading
          level="h2"
          className="text-xl font-semibold text-gray-800 mb-4"
        >
          Tu Carrito
        </Heading>
        <div className="border-t border-gray-100 pt-4">
          <CartTotals totals={cart} />
          <FinancingCostDisplay />
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4">
          <ItemsPreviewTemplate cart={cart} />
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
