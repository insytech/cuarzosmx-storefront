import { Metadata } from "next"
import { Suspense } from "react"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// Separate async component for cart-related features
// This allows the page to render without waiting for cart/customer data
async function CartFeatures() {
  // Fetch customer and cart in parallel
  const [customer, cart] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
  ])

  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()
    shippingOptions = shipping_options
  }

  return (
    <>
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}
      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
    </>
  )
}

function NavFallback() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <div className="w-full bg-main-color text-white text-center text-[10px] sm:text-xs py-1.5 sm:py-2 font-semibold px-3 sm:px-8">
        &nbsp;
      </div>
      <header className="h-16 lg:h-20 mx-auto bg-white px-4 lg:px-8 shadow-sm" />
    </div>
  )
}

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<NavFallback />}>
        <Nav />
      </Suspense>
      <Suspense fallback={null}>
        <CartFeatures />
      </Suspense>
      {props.children}
      <Footer />
    </>
  )
}
