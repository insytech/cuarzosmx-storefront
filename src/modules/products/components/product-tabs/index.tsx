"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Información del Producto",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Envíos y Devoluciones",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white">
      <Accordion type="multiple" defaultValue={["Información del Producto"]}>
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-4 px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          {product.material && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Material</span>
              <span className="text-sm font-medium text-gray-800">{product.material}</span>
            </div>
          )}
          {product.origin_country && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">País de Origen</span>
              <span className="text-sm font-medium text-gray-800">{product.origin_country}</span>
            </div>
          )}
          {product.type && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Tipo</span>
              <span className="text-sm font-medium text-gray-800">{product.type.value}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {product.weight && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Peso</span>
              <span className="text-sm font-medium text-gray-800">{product.weight} g</span>
            </div>
          )}
          {product.length && product.width && product.height && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Dimensiones</span>
              <span className="text-sm font-medium text-gray-800">
                {product.length}L x {product.width}W x {product.height}H
              </span>
            </div>
          )}
        </div>
      </div>
      {!product.material && !product.origin_country && !product.type && !product.weight && (
        <p className="text-sm text-gray-500 italic">
          No hay información adicional disponible para este producto.
        </p>
      )}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-4 px-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-sm text-gray-800">Envío Rápido</span>
            <p className="text-xs text-gray-600 mt-0.5">
              Tu paquete llegará en 1-5 días hábiles a todo México.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-sm text-gray-800">Cambios Sencillos</span>
            <p className="text-xs text-gray-600 mt-0.5">
              ¿No era lo que esperabas? Contáctanos en 24hrs para un cambio.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-sm text-gray-800">Devoluciones Fáciles</span>
            <p className="text-xs text-gray-600 mt-0.5">
              Si el producto llega dañado, te reembolsamos sin complicaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
