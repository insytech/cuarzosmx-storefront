import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
        {images[0]?.url && (
          <Image
            src={images[0].url}
            priority
            className="object-cover hover:scale-105 transition-transform duration-500"
            alt="Product main image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-600 flex items-center gap-1.5 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
          Ampliar
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image.id}
              className={`relative aspect-square overflow-hidden rounded-xl bg-gray-100 border-2 transition-all duration-200 hover:border-main-color ${index === 0 ? "border-main-color" : "border-transparent"
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
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Additional Images (if more than 1) */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-4 mt-2">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 shadow-sm"
            >
              {image.url && (
                <Image
                  src={image.url}
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  alt={`Product image ${index + 2}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
