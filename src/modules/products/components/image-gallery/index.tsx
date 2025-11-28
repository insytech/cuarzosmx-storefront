"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  thumbnail?: string | null
}

const ImageGallery = ({ images, thumbnail }: ImageGalleryProps) => {
  // Build the display list: if thumbnail exists and isn't already in images, prepend it
  const allImages = (() => {
    if (!thumbnail) return images || []
    const thumbnailInImages = images?.some((img) => img.url === thumbnail)
    if (thumbnailInImages) return images
    // Prepend thumbnail as a synthetic image entry
    return [{ id: "thumbnail", url: thumbnail }, ...(images || [])] as HttpTypes.StoreProductImage[]
  })()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Navigate to previous/next image
  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }, [allImages.length])

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }, [allImages.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false)
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isLightboxOpen, goToPrevious, goToNext])

  if (!allImages || allImages.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    )
  }

  const mainImage = allImages[selectedIndex]?.url

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div
          className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          {mainImage && (
            <Image
              src={mainImage}
              priority
              className="object-cover hover:scale-105 transition-transform duration-500"
              alt="Product main image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* Zoom hint */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-600 flex items-center gap-1.5 shadow-sm hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
            Ampliar
          </button>

          {/* Navigation arrows for mobile/desktop */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Imagen anterior"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Siguiente imagen"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid - clickable */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {allImages.slice(0, 8).map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-xl bg-gray-100 border-2 transition-all duration-200 hover:border-main-color ${index === selectedIndex ? "border-main-color ring-2 ring-main-color/30" : "border-transparent"
                  }`}
              >
                {image.url && (
                  <Image
                    src={image.url}
                    className="object-cover"
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="120px"
                  />
                )}
                {index === 7 && allImages.length > 8 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      +{allImages.length - 8}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Main lightbox image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {mainImage && (
              <Image
                src={mainImage}
                className="object-contain"
                alt="Product image enlarged"
                fill
                sizes="100vw"
                quality={100}
              />
            )}
          </div>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Imagen anterior"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Siguiente imagen"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnail strip at bottom */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-xl">
              {allImages.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex(index)
                  }}
                  className={`relative w-16 h-16 overflow-hidden rounded-lg transition-all ${index === selectedIndex
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-75"
                    }`}
                >
                  {image.url && (
                    <Image
                      src={image.url}
                      className="object-cover"
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="64px"
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Keyboard hint */}
          <div className="absolute bottom-4 right-4 text-white/50 text-xs hidden md:block">
            Usa ← → para navegar • Esc para cerrar
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
