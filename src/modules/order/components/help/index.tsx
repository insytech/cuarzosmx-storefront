import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi text-gray-800">¿Necesitas ayuda?</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact" className="text-main-color hover:text-main-color-dark">Contacto</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact" className="text-main-color hover:text-main-color-dark">
              Devoluciones y Cambios
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
