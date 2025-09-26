"use client"

import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, Parallax } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/parallax'

const Hero = () => {
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop',
      title: 'Bienvenido a CuarzosMX',
      subtitle: 'Descubre Joyería Única de Cuarzo',
      buttonText: 'Explorar Colección'
    },
    {
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop',
      title: 'Elegancia Natural',
      subtitle: 'Piezas que reflejan tu esencia',
      buttonText: 'Ver Catálogo'
    },
    {
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop',
      title: 'Calidad Premium',
      subtitle: 'Cristales seleccionados con cuidado',
      buttonText: 'Comprar Ahora'
    }
  ]

  return (
    <div className="h-[75vh] w-full relative overflow-hidden">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        parallax={true}
        modules={[Autoplay, Pagination, Navigation, Parallax]}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full rounded-2xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={slide.image}
                alt={slide.title}
                data-swiper-parallax="-30%"
              />
              <div className="absolute inset-0  flex flex-col justify-center items-center text-center p-8">
                <div className="space-y-6 max-w-2xl">
                  <Heading
                    level="h1"
                    className="text-4xl md:text-6xl leading-tight text-white font-light drop-shadow-2xl"
                  >
                    {slide.title}
                  </Heading>
                  <Heading
                    level="h2"
                    className="text-xl md:text-3xl leading-relaxed text-white font-light drop-shadow-lg"
                  >
                    {slide.subtitle}
                  </Heading>
                  <LocalizedClientLink href="/store">
                    <Button className="bg-white hover:bg-gray-100 text-black px-10 py-3 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 font-medium">
                      {slide.buttonText}
                    </Button>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Hero
