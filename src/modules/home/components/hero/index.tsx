"use client"

import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'

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
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="max-w-4xl">
            <div
              className="h-full bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-purple/30 to-transparent rounded-2xl" />
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <div className="space-y-6 max-w-2xl">
                  <Heading
                    level="h1"
                    className="text-5xl md:text-7xl leading-tight text-white font-light drop-shadow-2xl"
                  >
                    {slide.title}
                  </Heading>
                  <Heading
                    level="h2"
                    className="text-2xl md:text-4xl leading-relaxed text-light-gray font-light drop-shadow-lg"
                  >
                    {slide.subtitle}
                  </Heading>
                  <LocalizedClientLink href="/store">
                    <Button className="bg-purple hover:bg-dark-purple text-white px-12 py-4 rounded-full shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-110 font-medium text-lg">
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
