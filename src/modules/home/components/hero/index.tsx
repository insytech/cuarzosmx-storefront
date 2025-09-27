"use client"

import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, Parallax } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

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
    },
    {
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=800&fit=crop',
      title: 'Regalos con Significado',
      subtitle: 'Sorprende con joyería de cuarzo',
      buttonText: 'Descubre Más'
    },
    {
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=800&fit=crop',
      title: 'Artesanía y Diseño',
      subtitle: 'Hecho a mano con pasión, descubre nuestras promociones y descuentos de hasta el 22% en piezas seleccionadas.',
      buttonText: 'Conoce al Artesano'
    }
  ]

  return (
    <div className="h-[90vh] relative overflow-hidden">
      <Swiper
        grabCursor={true}
        spaceBetween={40}
        slidesPerView={1.5}
        centeredSlides={true}
        speed={900}
        parallax={true}
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay, Parallax, Pagination, Navigation]}
        className="h-[90vh] "
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="object-cover">
            <div className="relative h-[80%] rounded-2xl overflow-hidden">
              <div className="img-wrapper">
                <img
                  className="w-full h-full object-cover"
                  src={slide.image}
                  alt={slide.title}
                  data-swiper-parallax-x="30%"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 p-8">
                <div className="z-20 absolute left-4 bottom-4 max-w-2xl">
                  <Heading
                    level="h1"
                    className="text-4xl md:text-6xl leading-tight text-white font-bold text-left drop-shadow-2xl"
                  >
                    {slide.title}
                  </Heading>
                  <Heading
                    level="h2"
                    className="text-xl md:text-3xl leading-relaxed text-white font-bold text-left drop-shadow-lg mt-2"
                  >
                    {slide.subtitle}
                  </Heading>
                </div>
                <LocalizedClientLink href="/store">
                  <Button className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-black px-10 py-3 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 font-medium z-20">
                    {slide.buttonText}
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Hero