"use client"

import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules'
import { useState, useRef } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'

const Hero = () => {
  const [parallaxStyles, setParallaxStyles] = useState<Record<number, { container: React.CSSProperties; image: React.CSSProperties; content: React.CSSProperties }>>({})

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

  const calculateParallax = (swiper: any) => {
    const slides = swiper.slides
    const newStyles: Record<number, { container: React.CSSProperties; image: React.CSSProperties; content: React.CSSProperties }> = {}

    slides.forEach((slide: any, index: number) => {
      const slideProgress = slide.progress
      const absProgress = Math.abs(slideProgress)

      // Container scale
      const containerScale = 1.25 - absProgress * 0.25 // Scale from 1.25 to 1

      // Image transforms
      const imageTranslateX = slideProgress * 50 // TranslateX for image
      const imageScale = 1.125 - absProgress * 0.125 // Scale from 1.125 to 1
      const grayscale = absProgress // Grayscale 0 to 1

      // Content transforms
      const contentTranslateX = slideProgress * 100 // Content translateX
      const opacity = Math.max(0, 1 - absProgress * 2) // Opacity fades faster

      newStyles[index] = {
        container: {
          transform: `scale(${containerScale})`,
          transformOrigin: slideProgress > 0 ? 'left center' : 'right center',
          transitionDuration: '0ms',
        },
        image: {
          transform: `translateX(${imageTranslateX}%) scale(${imageScale})`,
          filter: `grayscale(${grayscale})`,
          transformOrigin: slideProgress > 0 ? 'left center' : 'right center',
          transitionDuration: '0ms',
        },
        content: {
          transform: `translateX(${contentTranslateX}%)`,
          opacity,
          transitionDuration: '0ms',
        }
      }
    })

    setParallaxStyles(newStyles)
  }

  return (
    <div className="h-[75vh] w-full relative overflow-hidden pt-8">
      <Swiper
        spaceBetween={16}
        centeredSlides={true}
        slidesPerView={1.2}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
        onProgress={calculateParallax}
        onSlideChange={calculateParallax}
        onSwiper={calculateParallax}
        breakpoints={{
          640: {
            slidesPerView: 1.8,
          },
          1024: {
            slidesPerView: 2.2,
          },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="expo-container relative rounded-3xl overflow-hidden"
              style={parallaxStyles[index]?.container}
            >
              <img
                className="expo-image w-full h-full object-cover"
                src={slide.image}
                alt={slide.title}
                style={parallaxStyles[index]?.image}
              />
              <div
                className="expo-content absolute inset-0 flex flex-col justify-center items-center text-center p-8"
                style={parallaxStyles[index]?.content}
              >
                <div className="space-y-6 max-w-2xl">
                  <Heading
                    level="h1"
                    className="text-5xl md:text-7xl leading-tight text-white font-light drop-shadow-2xl"
                  >
                    {slide.title}
                  </Heading>
                  <Heading
                    level="h2"
                    className="text-2xl md:text-4xl leading-relaxed text-white font-light drop-shadow-lg"
                  >
                    {slide.subtitle}
                  </Heading>
                  <LocalizedClientLink href="/store">
                    <Button className="bg-white hover:bg-gray-100 text-black px-12 py-4 rounded-full shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-110 font-medium text-lg">
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
