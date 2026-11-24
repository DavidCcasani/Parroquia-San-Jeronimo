import { useState, useEffect, useRef } from 'react'
import { CREACION_STAGES } from './historiaData'

function CreacionHistoriaSection({ onSelectImage }) {
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const scrollyContainerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollyContainerRef.current) return
      const rect = scrollyContainerRef.current.getBoundingClientRect()
      const scrollableDistance =
        scrollyContainerRef.current.offsetHeight - window.innerHeight
      if (scrollableDistance <= 0) return

      const scrolled = -rect.top + 80
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance))
      const targetIndex = Math.min(
        CREACION_STAGES.length - 1,
        Math.floor(progress * CREACION_STAGES.length)
      )
      setActiveStageIndex(targetIndex)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const jumpToStage = (index) => {
    setActiveStageIndex(index)
    if (!scrollyContainerRef.current) return
    const scrollableDistance =
      scrollyContainerRef.current.offsetHeight - window.innerHeight
    const containerTop =
      window.pageYOffset +
      scrollyContainerRef.current.getBoundingClientRect().top
    const targetTop =
      containerTop +
      (index / (CREACION_STAGES.length - 1)) * scrollableDistance -
      60
    window.scrollTo({ top: targetTop, behavior: 'smooth' })
  }

  const currentStage = CREACION_STAGES[activeStageIndex]

  return (
    <div className="pt-2">
      {/* CONTENEDOR SCROLLYTELLING (Sticky Split-Screen) */}
      <div
        ref={scrollyContainerRef}
        className="relative"
        style={{ minHeight: `${CREACION_STAGES.length * 20}vh` }}
      >
        {/* Bloque Dividido (Card + Imagen) con bordes redondeados y mayor altura vertical */}
        <div className="sticky top-16 z-10 w-full rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[640px] sm:min-h-[700px] lg:h-[calc(100vh-5.5rem)] max-h-[860px] border border-slate-200/40">
          {/* LADO IZQUIERDO: Pila de Cards con Animación hacia la Derecha y Arriba (Letras Fijas) */}
          <div className="lg:col-span-6 relative overflow-hidden select-none min-h-[500px] sm:min-h-[580px] lg:min-h-full bg-transparent rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
            {CREACION_STAGES.map((stg, i) => {
              const isExited = i < activeStageIndex
              const isActive = i === activeStageIndex

              return (
                <div
                  key={stg.step}
                  style={{
                    backgroundColor: stg.bg,
                    color: stg.fg,
                    fontFamily: "'Figtree', sans-serif",
                    transform: isExited
                      ? 'translate(104%, -50px)'
                      : 'translate(0, 0)',
                    opacity: isExited ? 0 : 1,
                    zIndex: isActive ? 20 : isExited ? 30 : 10 - i,
                    transition:
                      'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease-out',
                  }}
                  className="absolute inset-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-center will-change-transform overflow-hidden rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl"
                >
                  {/* Contenedor de Texto con contra-transformación para que las letras no se muevan */}
                  <div
                    style={{
                      transform: isExited
                        ? 'translate(-104%, 50px)'
                        : 'translate(0, 0)',
                      opacity: isExited ? 0 : 1,
                      transition:
                        'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out',
                    }}
                    className="max-w-[480px] will-change-transform"
                  >
                    <p className="text-xs sm:text-sm font-medium tracking-normal mb-2 opacity-80">
                      {stg.category}
                    </p>

                    <h2
                      style={{
                        fontFamily: "'Figtree', sans-serif",
                        letterSpacing: '-0.03em',
                        lineHeight: 1.06,
                      }}
                      className="font-medium text-3xl sm:text-4xl lg:text-5xl mb-6 text-balance"
                    >
                      {stg.title}
                    </h2>

                    <p
                      style={{
                        fontFamily: "'Figtree', sans-serif",
                        lineHeight: 1.45,
                      }}
                      className="text-sm sm:text-base mb-8 opacity-90 max-w-[460px]"
                    >
                      {stg.paragraph}
                    </p>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectImage({
                            src: stg.image,
                            title: stg.imageTitle,
                            category: stg.category,
                            caption: stg.imageCaption,
                          })
                        }
                        style={{
                          borderColor: 'currentColor',
                          fontFamily: "'Figtree', sans-serif",
                        }}
                        className="border px-7 py-3 text-xs sm:text-sm transition-all rounded-xl cursor-pointer tracking-normal font-normal opacity-90 hover:opacity-100 hover:bg-white/20 active:scale-95 shadow-sm"
                      >
                        {stg.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* LADO DERECHO: Fotografía de Gran Formato Completa con Fondo Transparente */}
          <div className="lg:col-span-6 relative bg-transparent overflow-hidden min-h-[460px] sm:min-h-[540px] lg:min-h-full flex items-center justify-center p-6 sm:p-8 select-none rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
            <div className="relative z-10 w-full flex flex-col items-center justify-center pb-14 sm:pb-16">
              <div className="relative flex items-center justify-center max-w-xl max-h-[calc(100vh-14rem)] group">
                {CREACION_STAGES.map((stg, idx) => {
                  const isCurrent = idx === activeStageIndex
                  return (
                    <img
                      key={stg.step}
                      src={stg.image}
                      alt={stg.imageTitle}
                      className={`w-auto max-w-full h-auto max-h-[calc(100vh-14rem)] object-contain transition-all duration-700 ease-out cursor-pointer rounded-2xl shadow-xl border-2 border-[#c5a059]/50 hover:border-[#5e1224] ${
                        isCurrent
                          ? 'opacity-100 scale-100 relative'
                          : 'opacity-0 scale-95 absolute inset-0 m-auto pointer-events-none'
                      }`}
                      onClick={() =>
                        onSelectImage({
                          src: stg.image,
                          title: stg.imageTitle,
                          category: stg.category,
                          caption: stg.imageCaption,
                        })
                      }
                    />
                  )
                })}

                <button
                  type="button"
                  onClick={() =>
                    onSelectImage({
                      src: currentStage.image,
                      title: currentStage.imageTitle,
                      category: currentStage.category,
                      caption: currentStage.imageCaption,
                    })
                  }
                  className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#5e1224] hover:bg-[#5e1224] hover:text-[#c5a059] transition-all text-[11px] font-bold flex items-center gap-1.5 shadow-lg cursor-pointer border border-[#c5a059]/60"
                >
                  <svg
                    className="w-3.5 h-3.5"
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
                  <span>Ampliar foto</span>
                </button>
              </div>

              <div className="mt-4 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#c5a059]/40 text-slate-800 text-xs flex items-center gap-2 max-w-md text-center shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#c5a059] shrink-0" />
                <span className="truncate font-semibold">{currentStage.imageTitle}</span>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex items-end justify-between z-20 pointer-events-auto">
              <span
                style={{ fontFamily: "'Figtree', sans-serif" }}
                className="text-[#5e1224] text-xs sm:text-sm font-bold tracking-wide bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#c5a059]/40 shadow-md"
              >
                {currentStage.step} / 05 &nbsp;&bull;&nbsp; {currentStage.category}
              </span>

              <button
                type="button"
                onClick={() =>
                  jumpToStage((activeStageIndex + 1) % CREACION_STAGES.length)
                }
                className="w-12 h-12 rounded-full bg-[#5e1224] text-[#c5a059] hover:text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-lg shrink-0 border-2 border-[#c5a059]"
                title={
                  activeStageIndex === CREACION_STAGES.length - 1
                    ? 'Volver al inicio'
                    : 'Siguiente hito'
                }
              >
                {activeStageIndex === CREACION_STAGES.length - 1 ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none opacity-0 select-none">
          {CREACION_STAGES.map((_, i) => (
            <div key={i} className="h-[20vh]" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreacionHistoriaSection
