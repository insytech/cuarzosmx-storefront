import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full relative bg-gradient-to-br from-beige via-light-purple to-gold">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-8">
        <span className="space-y-4">
          <Heading
            level="h1"
            className="text-4xl md:text-5xl leading-tight text-black font-serif font-light"
          >
            Bienvenido a CuarzosMX
          </Heading>
          <Heading
            level="h2"
            className="text-2xl md:text-3xl leading-relaxed text-dark-purple font-light"
          >
            Descubre Joyería Única de Cuarzo
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button className="bg-purple hover:bg-dark-purple text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl">
            Explorar Colección
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
