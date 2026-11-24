import { useState, useEffect } from 'react'
import PageShell from '../components/PageShell'

const GALLERY_IMAGES = [
  '/imagenes/imagenes galeria/JULIO-3.jpg',
  '/imagenes/imagenes galeria/39.jpg',
  '/imagenes/imagenes galeria/52.jpg',
  '/imagenes/imagenes galeria/54.jpg',
  '/imagenes/imagenes galeria/img007.jpg',
  '/imagenes/imagenes galeria/img027.jpg',
  '/imagenes/imagenes galeria/img051.jpg',
  '/imagenes/imagenes galeria/img052.jpg',
  '/imagenes/imagenes galeria/img053.jpg',
  '/imagenes/imagenes galeria/img070.jpg',
  '/imagenes/imagenes galeria/img074.jpg',
  '/imagenes/imagenes galeria/img094.jpg',
  '/imagenes/imagenes galeria/img121.jpg',
  '/imagenes/imagenes galeria/img122.jpg',
  '/imagenes/imagenes galeria/img124.jpg',
  '/imagenes/imagenes galeria/img128.jpg',
  '/imagenes/imagenes galeria/img129.jpg',
  '/imagenes/imagenes galeria/img168.jpg',
  '/imagenes/imagenes galeria/img174.jpg',
  '/imagenes/imagenes galeria/img187.jpg',
  '/imagenes/imagenes galeria/img223.jpg',
  '/imagenes/imagenes galeria/img224.jpg',
  '/imagenes/imagenes galeria/img228.jpg',
  '/imagenes/imagenes galeria/img248.jpg',
  '/imagenes/imagenes galeria/img255.jpg',
]

function GaleriaPage() {
  const [selectedIndex, setSelectedIndex] = useState(null)

  // Navegación con teclado en el modal (Escape, Flecha Izquierda, Flecha Derecha)
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null)
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % GALLERY_IMAGES.length)
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  return (
    <PageShell title="Galería">
      {/* Lightbox / Modal a pantalla completa (Sin texto) */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#5e1224] transition-colors cursor-pointer text-lg font-bold z-50 border border-white/20"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Flecha anterior */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#5e1224] transition-colors cursor-pointer text-xl z-50 border border-white/20"
            aria-label="Anterior"
          >
            &#8249;
          </button>

          {/* Flecha siguiente */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex((prev) => (prev + 1) % GALLERY_IMAGES.length)
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#5e1224] transition-colors cursor-pointer text-xl z-50 border border-white/20"
            aria-label="Siguiente"
          >
            &#8250;
          </button>

          {/* Imagen completa sin recortes ni texto */}
          <div
            className="relative max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_IMAGES[selectedIndex]}
              alt=""
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Galería Fotográfica: Masonry responsivo, solo imágenes sin texto */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
        {GALLERY_IMAGES.map((src, index) => (
          <div
            key={src}
            onClick={() => setSelectedIndex(index)}
            className="break-inside-avoid group relative rounded-2xl overflow-hidden border-2 border-[#c5a059]/40 hover:border-[#5e1224] bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 block"
            />
            {/* Overlay sutil al pasar el mouse */}
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/90 text-[#5e1224] flex items-center justify-center shadow-lg">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

export default GaleriaPage
