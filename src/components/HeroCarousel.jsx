function HeroCarousel({ images, currentIndex }) {
  return (
    <section
      id="inicio"
      className="relative h-screen w-full overflow-hidden bg-black select-none"
    >
      {images.map((src, index) => {
        const isActive = index === currentIndex
        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={src}
              alt={`Imagen ${index + 1}`}
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        )
      })}

      {/* Capa negra transparente encima de las imágenes principales */}
      <div className="absolute inset-0 z-20 bg-black/25 pointer-events-none" />
    </section>
  )
}

export default HeroCarousel
