import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-morado relative bg-beige">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-negro font-normal"
          >
            Welcome to CuarzosMX
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-morado-oscuro font-normal"
          >
            Discover Unique Quartz Jewelry
          </Heading>
        </span>
      </div>
    </div>
  )
}

export default Hero
