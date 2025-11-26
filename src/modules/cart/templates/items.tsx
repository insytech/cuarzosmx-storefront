import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div>
      <div className="pb-4 border-b border-gray-100 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Productos en tu carrito</h2>
        <p className="text-sm text-gray-500 mt-1">
          {items?.length || 0} {(items?.length || 0) === 1 ? 'artículo' : 'artículos'}
        </p>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-sm font-medium text-gray-500">
        <div className="col-span-6">Producto</div>
        <div className="col-span-2 text-center">Cantidad</div>
        <div className="col-span-2 text-right">Precio</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100">
        {items
          ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => {
              return (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code}
                />
              )
            })
          : repeat(3).map((i) => {
            return <SkeletonLineItem key={i} />
          })}
      </div>
    </div>
  )
}

export default ItemsTemplate
