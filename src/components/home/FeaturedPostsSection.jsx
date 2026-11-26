import { useEffect, useRef, useState } from 'react'
import { EVENTOS_PARROQUIALES } from '../../data/eventosData'

function FeaturedPostsSection({ onNavigate }) {
  // Consumir eventos marcados como destacados
  const featuredEvents = EVENTOS_PARROQUIALES.filter((evt) => evt.destacado)

  const [itemsPerView, setItemsPerView] = useState(3)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartXRef = useRef(0)

  // Responsividad: 1 en móvil, 2 en tablet, 3 en escritorio
  useEffect(() => {
    const handleResize = () => {
      let perView = 3
      if (window.innerWidth < 640) {
        perView = 1
      } else if (window.innerWidth < 1024) {
        perView = 2
      }
      setItemsPerView(perView)
      setCurrentIndex((prev) => {
        const newMax = Math.max(0, featuredEvents.length - perView)
        return prev > newMax ? newMax : prev
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [featuredEvents.length])

  const maxIndex = Math.max(0, featuredEvents.length - itemsPerView)
  const displayIndex = Math.min(currentIndex, maxIndex)

  // Avance automático en bucle cada 5.5 segundos (pausa si isPaused)
  useEffect(() => {
    if (isPaused || featuredEvents.length <= itemsPerView) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5500)

    return () => clearInterval(timer)
  }, [isPaused, itemsPerView, featuredEvents.length, maxIndex])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  // Soporte táctil en móviles para deslizar el carrusel
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e) => {
    setIsPaused(false)
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX

    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }
  }

  return (
    <section
      id="publicaciones"
      className="w-full bg-gradient-to-b from-[#520d1f] via-[#5e1224] to-[#420815] text-white py-24 select-none relative overflow-hidden"
    >
      {/* Adorno sutil de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        {/* Encabezado Editorial */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c5a059]">
            Gaceta y Actualidad Parroquial
          </span>
          <h2
            style={{ fontFamily: "'Roboto Slab', serif" }}
            className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide"
          >
            Publicaciones y Eventos Destacados
          </h2>
          <div className="mt-4 mx-auto h-0.5 w-14 bg-[#c5a059]" />
          <p className="mt-3 text-xs sm:text-sm text-white/70 max-w-xl mx-auto font-sans leading-relaxed">
            Crónicas, celebraciones litúrgicas, convocatorias pastorales y vida comunitaria en el valle de San Jerónimo.
          </p>
        </div>

        {/* Carrusel Editorial */}
        <div
          className="relative px-2 sm:px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Contenedor con overflow hidden */}
          <div className="overflow-hidden w-full py-4">
            <div
              className="flex transition-transform duration-700 ease-out -mx-3"
              style={{
                transform: `translateX(-${displayIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {featuredEvents.map((post) => (
                <div
                  key={post.id}
                  className="shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <article
                    onClick={(e) => onNavigate(e, '/publicaciones/eventos')}
                    className="group h-full flex flex-col justify-between rounded-2xl bg-[#fffdfa] border border-[#c5a059]/35 hover:border-[#c5a059] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    {/* Imagen con Proporción 16:10 y Sello Editorial */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                      <img
                        src={post.imagen}
                        alt={post.titulo}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Sello editorial de fecha en esquina superior izquierda */}
                      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-md bg-[#5e1224] text-[#c5a059] border border-[#c5a059]/40 shadow-md flex items-center gap-1.5 text-xs font-serif font-bold tracking-wide">
                        <svg
                          className="w-3.5 h-3.5 text-[#c5a059] shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{post.fecha}</span>
                      </div>

                      {/* Degradado inferior para contraste sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                    </div>

                    {/* Contenido Editorial de la Tarjeta */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#5e1224]">
                            {post.categoria}
                          </span>
                          {post.etiqueta && (
                            <span className="text-[9px] uppercase font-bold text-[#5e1224] bg-[#5e1224]/10 px-2 py-0.5 rounded-full border border-[#5e1224]/20">
                              {post.etiqueta}
                            </span>
                          )}
                        </div>

                        <h3
                          style={{ fontFamily: "'Roboto Slab', serif" }}
                          className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#5e1224] transition-colors leading-snug line-clamp-2"
                        >
                          {post.titulo}
                        </h3>

                        <p className="mt-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-2 font-sans">
                          {post.resumen}
                        </p>
                      </div>

                      {/* Pie de Tarjeta con Lugar y Enlace */}
                      <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium truncate max-w-[140px] sm:max-w-[170px] inline-flex items-center gap-1.5">
                          <svg
                            className="w-3.5 h-3.5 text-[#c5a059] shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="truncate">{post.lugar}</span>
                        </span>
                        <span className="font-bold text-[#5e1224] group-hover:text-[#c5a059] group-hover:translate-x-1 transition-all inline-flex items-center gap-1">
                          <span>Ver detalles</span>
                          <span>&rarr;</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas de navegación discretas */}
          {featuredEvents.length > itemsPerView && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Anterior publicación"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#5e1224] text-[#c5a059] border border-[#c5a059]/60 shadow-xl flex items-center justify-center hover:bg-[#480d1b] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-sm font-bold">◄</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Siguiente publicación"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#5e1224] text-[#c5a059] border border-[#c5a059]/60 shadow-xl flex items-center justify-center hover:bg-[#480d1b] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-sm font-bold">►</span>
              </button>
            </>
          )}

          {/* Indicadores de Puntos */}
          {maxIndex > 0 && (
            <div className="flex items-center justify-center gap-2 mt-7">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    displayIndex === idx
                      ? 'w-7 h-2 bg-[#c5a059]'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Ir a la página ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Botón inferior para navegar a la cartelera completa de eventos */}
        <div className="mt-12 text-center">
          <a
            href="/publicaciones/eventos"
            onClick={(e) => onNavigate(e, '/publicaciones/eventos')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#c5a059] hover:bg-[#d6af66] text-[#5e1224] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-2xl transition-all cursor-pointer active:scale-95 border-2 border-white/20"
          >
            <span>Ver Cartelera Completa de Eventos</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedPostsSection
