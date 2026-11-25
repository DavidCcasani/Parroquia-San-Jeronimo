import { useEffect, useRef, useState } from 'react'
import * as PageFlipModule from 'page-flip'

// Importación robusta compatible con ESM / UMD de page-flip
const PageFlip =
  PageFlipModule.PageFlip ||
  PageFlipModule.default?.PageFlip ||
  PageFlipModule.default

const DEFAULT_AUDIO_VOLUME = 0.5
const AUTO_PLAY_INTERVAL_MS = 6500

function CreacionHistoriaSection({ onSelectImage }) {
  const bookContainerRef = useRef(null)
  const pagesSourceRef = useRef(null)
  const pageFlipRef = useRef(null)
  const audioRef = useRef(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(12)
  const [orientation, setOrientation] = useState('landscape') // 'portrait' | 'landscape'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isMutedAudio, setIsMutedAudio] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const lastManualNavRef = useRef(0)
  const hasHoverOpenedRef = useRef(false)

  const stopAutoPlay = () => {
    setIsAutoPlaying(false)
  }

  const handleCoverMouseEnter = () => {
    const flip = pageFlipRef.current
    if (!flip) return

    // Solo si estamos exactamente en la portada (índice 0)
    if (flip.getCurrentPageIndex() !== 0) return

    // Cooldown de 1.5s para evitar que se abra de golpe si el usuario acaba de retroceder
    if (Date.now() - lastManualNavRef.current < 1500) return

    // Evitar disparos repetidos mientras el cursor siga dentro
    if (hasHoverOpenedRef.current) return

    hasHoverOpenedRef.current = true
    stopAutoPlay()
    flip.flipNext()
  }

  const handleCoverMouseLeave = () => {
    hasHoverOpenedRef.current = false
  }

  // 1. Inicialización y ciclo de vida de PageFlip
  useEffect(() => {
    if (!bookContainerRef.current || !pagesSourceRef.current) return

    // Contenedor anfitrión exclusivo para PageFlip
    const host = document.createElement('div')
    host.className = 'flip-book-host w-full h-full'
    bookContainerRef.current.appendChild(host)

    let flipInstance = null

    try {
      flipInstance = new PageFlip(host, {
        width: 500,
        height: 680,
        size: 'stretch',
        minWidth: 280,
        maxWidth: 780,
        minHeight: 420,
        maxHeight: 1000,
        maxShadowOpacity: 0.55,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: true,
        flippingTime: 750,
        useMouseEvents: true,
        clickEventForward: true,
      })

      // Clonar los elementos de páginas pre-renderizados para preservar el árbol de React
      const sourcePages = Array.from(pagesSourceRef.current.children)
      const clonedPages = sourcePages.map((el) => {
        const clone = el.cloneNode(true)
        clone.classList.remove('hidden')
        return clone
      })

      flipInstance.loadFromHTML(clonedPages)
      pageFlipRef.current = flipInstance

      flipInstance.on('flip', (e) => {
        setCurrentPage(e.data)
        if (e.data === 0) {
          lastManualNavRef.current = Date.now()
          hasHoverOpenedRef.current = false
        }
      })

      flipInstance.on('init', () => {
        setTotalPages(flipInstance.getPageCount())
        setCurrentPage(flipInstance.getCurrentPageIndex())
        setOrientation(flipInstance.getOrientation())
      })

      flipInstance.on('changeOrientation', (e) => {
        setOrientation(e.data)
      })

      // Si el usuario dobla o arrastra una esquina, detener auto-play
      flipInstance.on('changeState', (e) => {
        if (e.data === 'user_fold' || e.data === 'fold_corner') {
          setIsAutoPlaying(false)
        }
      })
    } catch (err) {
      console.error('Error al inicializar PageFlip:', err)
    }

    // Delegación de eventos para ampliación de fotos (Lightbox)
    const handleHostClick = (e) => {
      stopAutoPlay()
      const target = e.target.closest('[data-zoom-src]')
      if (target && onSelectImage) {
        onSelectImage({
          src: target.getAttribute('data-zoom-src'),
          title: target.getAttribute('data-zoom-title') || '',
          caption: target.getAttribute('data-zoom-caption') || '',
          category: target.getAttribute('data-zoom-category') || 'Historia',
        })
      }
    }
    host.addEventListener('click', handleHostClick)

    // Atajos de teclado para pasar páginas
    const handleKeyDown = (e) => {
      if (!flipInstance) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        stopAutoPlay()
        flipInstance.flipNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        stopAutoPlay()
        flipInstance.flipPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      host.removeEventListener('click', handleHostClick)
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy()
        } catch {
          // Destrucción limpia
        }
        pageFlipRef.current = null
      }
      if (host.parentNode) {
        host.parentNode.removeChild(host)
      }
    }
  }, [onSelectImage])

  // 2. Paso de páginas automático en bucle continuo (Auto-play)
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      const flip = pageFlipRef.current
      if (!flip) return

      try {
        const cur = flip.getCurrentPageIndex()
        const total = flip.getPageCount()

        if (cur >= total - 1) {
          // Llegó a la contraportada final, reiniciar bucle al inicio
          flip.turnToPage(0)
        } else {
          flip.flipNext()
        }
      } catch {
        // Manejo silencioso en transiciones
      }
    }, AUTO_PLAY_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // 2. Control del Audio Sacro (Hanaqpachap Kusikuynin)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = DEFAULT_AUDIO_VOLUME

    const tryPlay = () => {
      audio
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false))
    }

    tryPlay()

    const unlockOnInteraction = () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => setIsPlayingAudio(true))
          .catch(() => {})
      }
      window.removeEventListener('click', unlockOnInteraction)
      window.removeEventListener('scroll', unlockOnInteraction)
      window.removeEventListener('keydown', unlockOnInteraction)
    }

    window.addEventListener('click', unlockOnInteraction, { once: true })
    window.addEventListener('scroll', unlockOnInteraction, { once: true })
    window.addEventListener('keydown', unlockOnInteraction, { once: true })

    return () => {
      window.removeEventListener('click', unlockOnInteraction)
      window.removeEventListener('scroll', unlockOnInteraction)
      window.removeEventListener('keydown', unlockOnInteraction)
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const togglePlayAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {})
    } else {
      audio.pause()
      setIsPlayingAudio(false)
    }
  }

  const toggleMuteAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMutedAudio(audio.muted)
  }

  const handlePrev = () => {
    stopAutoPlay()
    lastManualNavRef.current = Date.now()
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev()
    }
  }

  const handleNext = () => {
    stopAutoPlay()
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext()
    }
  }

  const handleGoTo = (pageIdx) => {
    stopAutoPlay()
    lastManualNavRef.current = Date.now()
    if (pageFlipRef.current) {
      pageFlipRef.current.turnToPage(pageIdx)
    }
  }

  // Texto amigable de página actual
  const getPageLabel = () => {
    if (currentPage === 0) return 'Portada'
    if (currentPage >= totalPages - 1) return 'Contraportada'
    if (orientation === 'landscape') {
      const secondPage = Math.min(currentPage + 1, totalPages - 2)
      return `Páginas ${currentPage} – ${secondPage} de ${totalPages}`
    }
    return `Página ${currentPage} de ${totalPages}`
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Audio en vivo del himno */}
      <audio ref={audioRef} src="/audio/historia.mp3" loop preload="auto" />

      {/* BARRA SUPERIOR: Reproductor integrado de Ambiente Sacro */}
      <div className="w-full max-w-4xl mb-6 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#5e1224] via-[#480d1b] to-[#5e1224] border-2 border-[#c5a059] shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          {/* Botón de reproducción con ondas animadas */}
          <button
            type="button"
            onClick={togglePlayAudio}
            className="w-11 h-11 rounded-full bg-[#c5a059] hover:bg-[#d6af66] text-[#5e1224] flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
            title={isPlayingAudio ? 'Pausar ambiente sacro' : 'Reproducir ambiente sacro'}
          >
            {isPlayingAudio && !isMutedAudio ? (
              <span className="flex items-end gap-0.5 h-4">
                <span className="w-1 h-4 bg-[#5e1224] animate-pulse rounded-full" />
                <span className="w-1 h-2.5 bg-[#5e1224] animate-pulse rounded-full" />
                <span className="w-1 h-3.5 bg-[#5e1224] animate-pulse rounded-full" />
              </span>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#c5a059]">
                {isPlayingAudio ? 'Ambiente Sacro' : 'Música Virreinal'}
              </span>
              <span className="text-[10px] uppercase font-semibold bg-white/10 px-2 py-0.5 rounded-full text-white/80 border border-white/15">
                Cusco 1631
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium tracking-wide">
              «Hanaqpachap Kusikuynin» • Primer himno polifónico del Nuevo Mundo
            </p>
          </div>
        </div>

        {/* Controles de audio derecho: Silenciar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMuteAudio}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isMutedAudio
                ? 'bg-rose-900/60 text-rose-200 border border-rose-500/40'
                : 'bg-white/10 hover:bg-white/20 text-[#c5a059] border border-[#c5a059]/40'
            }`}
            title={isMutedAudio ? 'Reactivar sonido' : 'Silenciar'}
          >
            {isMutedAudio ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                <span>Silenciado</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span>Sonando</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DEL LIBRO INTERACTIVO */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none">
        {/* Estructura de Tapa Dura Realista que sobresale de las páginas (cubierta encuadernada) */}
        <div className="relative w-full p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#4a0d1c] via-[#350712] to-[#22030a] border-2 sm:border-[3px] border-[#c5a059] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_15px_30px_-10px_rgba(94,18,36,0.45)]">
          {/* Filete ornamental interior dorado de la tapa */}
          <div className="absolute inset-1.5 sm:inset-2.5 border border-[#c5a059]/40 rounded-xl sm:rounded-2xl pointer-events-none" />

          {/* Sombra de apoyo inferior profunda que simula reposo sobre una mesa */}
          <div className="absolute -bottom-6 inset-x-12 h-10 bg-black/55 blur-2xl rounded-full pointer-events-none -z-10" />

          {/* Bloque interno donde se monta el libro PageFlip */}
          <div
            ref={bookContainerRef}
            onMouseEnter={handleCoverMouseEnter}
            onMouseLeave={handleCoverMouseLeave}
            onPointerDown={stopAutoPlay}
            onTouchStart={stopAutoPlay}
            className="relative w-full h-[580px] sm:h-[680px] lg:h-[730px] flex items-center justify-center overflow-hidden rounded-lg shadow-[-5px_0_15px_rgba(0,0,0,0.3),5px_0_15px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* Estilos para sombreado interior natural en la unión de páginas (como el demo oficial de StPageFlip) */}
        <style>{`
          .stf__item.--left:not(.--hard) {
            box-shadow: inset -7px 0 24px -7px rgba(0, 0, 0, 0.25) !important;
          }
          .stf__item.--right:not(.--hard) {
            box-shadow: inset 7px 0 24px -7px rgba(0, 0, 0, 0.25) !important;
          }
        `}</style>

        {/* BARRA DE CONTROLES INFERIOR DEL LIBRO */}
        <div className="w-full max-w-3xl mt-5 px-4 py-3 rounded-2xl bg-white border-2 border-[#c5a059]/50 shadow-lg flex flex-wrap items-center justify-between gap-2.5 text-slate-800">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botón Portada */}
            <button
              type="button"
              onClick={() => handleGoTo(0)}
              disabled={currentPage === 0}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#5e1224] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer border border-slate-200"
            >
              Portada
            </button>

            {/* Botón Anterior */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5e1224] text-white hover:bg-[#480d1b] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs uppercase tracking-wider shadow-md active:scale-95"
            >
              <span>◄</span>
              <span>Anterior</span>
            </button>
          </div>

          {/* Centro: Indicador de página y botón de Auto-lectura */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 order-last sm:order-none w-full sm:w-auto justify-center">
            <span className="text-xs sm:text-sm font-bold text-[#5e1224] tracking-wide font-serif">
              {getPageLabel()}
            </span>

            {/* Botón de Auto-play interactivo */}
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-100 text-[#5e1224] border border-[#c5a059]/60 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
              }`}
              title={
                isAutoPlaying
                  ? 'Pausar avance automático de páginas'
                  : 'Activar avance automático cada 6.5 segundos'
              }
            >
              {isAutoPlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>⏸ Auto-lectura (6s)</span>
                </>
              ) : (
                <>
                  <span className="text-slate-500">▶</span>
                  <span>Activar auto-lectura</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botón Siguiente */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5e1224] text-white hover:bg-[#480d1b] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs uppercase tracking-wider shadow-md active:scale-95"
            >
              <span>Siguiente</span>
              <span>►</span>
            </button>

            {/* Botón Contraportada */}
            <button
              type="button"
              onClick={() => handleGoTo(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#5e1224] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer border border-slate-200"
            >
              Final
            </button>
          </div>
        </div>

        {/* Nota explicativa para el lector */}
        <p className="mt-3 text-[11px] text-slate-500 text-center max-w-lg leading-relaxed">
          📖 <strong>Lectura interactiva:</strong> Haz clic o arrastra las esquinas para pasar de página. El avance automático se detiene en cuanto interactúas con el libro.
        </p>
      </div>

      {/* PLANTILLA DE PÁGINAS (Renderizada por React, clonada por PageFlip) */}
      <div ref={pagesSourceRef} className="hidden" aria-hidden="true">
        {/* ==============================================================
            PÁGINA 0: PORTADA DURA
            ============================================================== */}
        <div
          data-density="hard"
          className="w-full h-full p-8 sm:p-10 flex flex-col justify-between text-center select-none shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#6b1429] via-[#5e1224] to-[#3a0814] text-[#c5a059]"
        >
          {/* Doble Marco Ornamental Dorado */}
          <div className="absolute inset-3.5 border-2 border-[#c5a059] pointer-events-none rounded-lg" />
          <div className="absolute inset-5 border border-[#c5a059]/60 pointer-events-none rounded-sm" />

          {/* Cintillo Sutil Superior */}
          <div className="relative z-10 pt-4 px-2">
            <span className="text-[10px] sm:text-[11px] font-serif italic text-[#c5a059]/90 block tracking-wide">
              Ambientado con el himno virreinal Hanaqpachap Kusikuynin, 1631
            </span>
            <div className="w-16 h-0.5 bg-[#c5a059]/50 mx-auto my-2" />
          </div>

          {/* Cuerpo Central: Título Principal, Emblema y Subtítulo */}
          <div className="relative z-10 my-auto flex flex-col items-center px-2">
            {/* Emblema Dorado */}
            <div className="w-20 h-20 mb-4 p-2 rounded-full border-2 border-[#c5a059] bg-[#5e1224]/80 flex items-center justify-center shadow-inner">
              <img
                src="/imagenes/logo principal dorado.png"
                alt="Emblema Parroquial"
                className="w-14 h-14 object-contain filter drop-shadow"
              />
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-serif font-black tracking-wider uppercase text-white drop-shadow-md leading-tight mb-2.5">
              CRÓNICA Y FUNDACIÓN DE SAN JERÓNIMO
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent my-1.5" />
            <p className="text-xs sm:text-[13px] font-serif text-[#c5a059] tracking-wide max-w-sm leading-relaxed">
              Memoria Histórica, Doctrina Colonial y Piedra Sagrada en el Valle de Chumbao
            </p>
          </div>

          {/* Pie de Portada */}
          <div className="relative z-10 pb-4">
            <p className="text-[11px] sm:text-xs tracking-widest uppercase text-[#c5a059] font-serif font-semibold">
              Siglos XVI – XXI • Andahuaylas
            </p>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 1: EXORDIO Y DEDICATORIA (Izquierda)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-3 border-b border-[#c5a059]/40 mb-5">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                In Nomine Domini
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#5e1224] mb-3 leading-snug">
              Exordio a la Memoria Sagrada
            </h2>

            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-serif mb-4 first-letter:text-3xl first-letter:font-bold first-letter:text-[#5e1224] first-letter:float-left first-letter:mr-2">
              Bajo la mirada serena de los cerros tutelares y en el corazón fértil del valle del Chumbao, se levantó en la segunda mitad del siglo XVI la Doctrina de San Jerónimo. Este libro testimonial reúne los ecos de los primeros doctrineros, el tañido centenario de sus campanas de bronce, la maestría de su torre exenta de piedra sillar y la devoción viva de una comunidad que custodia con veneración su templo patrimonial.
            </p>

            <blockquote className="p-3 my-3 bg-[#5e1224]/5 border-l-2 border-[#5e1224] rounded-r-lg text-[11px] italic text-[#5e1224] font-serif leading-relaxed">
              «¡Cuán amables son tus moradas, Señor de los ejércitos! Mi alma suspira y desfallece por los atrios del Señor.»
              <span className="block text-right font-sans not-italic text-[10px] text-slate-500 mt-1">
                — Salmo 84, 2
              </span>
            </blockquote>
          </div>

          <div className="pt-3 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Parroquia San Jerónimo</span>
            <span>— I —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 2: LA JOYA MUSICAL VIRREINAL (Derecha)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Música Sacra Virreinal &bull; 1631
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              «Hanaqpachap Kusikuynin»
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              Publicado en 1631 en el ritual formulario del párroco Juan Pérez Bocanegra en el Cusco, es la primera obra polifónica coral a cuatro voces impresa en todo el continente americano.
            </p>

            {/* Versos en Quechua y Castellano */}
            <div className="p-3 bg-amber-50/70 border border-[#c5a059]/50 rounded-xl mb-3 text-[10px] font-serif leading-relaxed grid grid-cols-2 gap-2">
              <div>
                <p className="font-bold text-[#5e1224] uppercase mb-1">Quechua (1631)</p>
                <p className="italic text-slate-800 leading-normal">
                  Hanaqpachap kusikuynin,<br />
                  Waranqaktam much'asqayki,<br />
                  Yupaychaypaq yurawaqi,<br />
                  Runap maskanankupaq,<br />
                  Uyariy rimaynillayta.
                </p>
              </div>
              <div>
                <p className="font-bold text-[#5e1224] uppercase mb-1">Castellano</p>
                <p className="italic text-slate-700 leading-normal">
                  Alegría del cielo,<br />
                  mil veces te alabaré,<br />
                  árbol sagrado y bendito,<br />
                  esperanza del mortal,<br />
                  atiende a mi plegaria.
                </p>
              </div>
            </div>

            {/* Fotografía de la pintura mural del coro */}
            <div
              data-zoom-src="/imagenes/imagenes arqui/20220526115751_IMG_7176.JPG"
              data-zoom-title="Pintura mural del sotocoro colonial"
              data-zoom-caption="Pintura mural virreinal con motivos florales andinos donde resonaba el canto sagrado."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes arqui/20220526115751_IMG_7176.JPG"
                alt="Pintura mural colonial"
                className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Canto y Liturgia</span>
            <span>— II —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 3: LA DOCTRINA COLONIAL Y EL TEMPLO (Izquierda)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Capítulo I &bull; Los Orígenes
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              La Doctrina Colonial
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              Fundada en la segunda mitad del siglo XVI como doctrina de evangelización en territorio de la nación Chanka. El templo y su entorno conformaron el núcleo organizador de la fe cristiana, los sacramentos y la vida comunitaria.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/7.jpg"
              data-zoom-title="Perspectiva histórica de la Plaza y Templo"
              data-zoom-caption="Registro fotográfico de la Plaza Mayor de San Jerónimo con su arboleda y el templo al fondo."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group mb-2"
            >
              <img
                src="/imagenes/imagenes historia/7.jpg"
                alt="Vista histórica de la plaza y templo"
                className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>

            <p className="text-[10px] text-slate-600 font-serif italic text-center">
              Fotografía histórica: Plaza Principal con el templo y su torre exenta.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Doctrina Chanka</span>
            <span>— III —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 4: LA PLAZA MATRIZ Y EL ATRIO (Derecha)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Espacio Sagrado y Ciudad
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              La Plaza Mayor y el Atrio
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              El amplio atrio de piedra adoquinada y la arboleda de la plaza fueron concebidos para acoger a miles de fieles durante las procesiones solemnes, la fiesta del Santo Patrón San Jerónimo y las magnas liturgias de Corpus Christi.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/WhatsApp Image 2025-09-05 at 12.09.18 PM (3).jpeg"
              data-zoom-title="Atrio y fachada principal"
              data-zoom-caption="Vista actual del atrio de piedra y la fachada encalada del templo parroquial."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group mb-2"
            >
              <img
                src="/imagenes/imagenes historia/WhatsApp Image 2025-09-05 at 12.09.18 PM (3).jpeg"
                alt="Atrio y fachada actual"
                className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>

            <p className="text-[10px] text-slate-600 font-serif italic text-center">
              Fachada principal y amplio atrio que articula la vida cívica y eclesial.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Atrio y Plaza</span>
            <span>— IV —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 5: EL CAMPANARIO EXENTO DE SILLAR (Izquierda)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Capítulo II &bull; Cantería Andina
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              El Campanario Exento
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              Erigida con sillares de piedra labrada y calicanto, la torre campanario exenta está separada deliberadamente del templo para mitigar los sismos andinos, erigiéndose como vigía espiritual del valle.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/40.jpg"
              data-zoom-title="Torre campanario de piedra sillar"
              data-zoom-caption="Estructura exenta de tres vanos de medio punto construida con sillares de cantería fina."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group mb-2"
            >
              <img
                src="/imagenes/imagenes historia/40.jpg"
                alt="Torre campanario histórica"
                className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>

            <p className="text-[10px] text-slate-600 font-serif italic text-center">
              Torre de tres vanos de medio punto: testimonio perenne de cantería colonial.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Cantería de Sillar</span>
            <span>— V —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 6: LAS CAMPANAS CENTENARIAS (Derecha)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Voz de Bronce
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              Campanas Virreinales
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              Fundidas con aleaciones de bronce y plata donada por los feligreses virreinales, sus badajos anuncian el Alba, el Ángelus y la convocatoria a la Santa Eucaristía para toda la comarca.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/img168.jpg"
              data-zoom-title="Campanario y campanas al atardecer"
              data-zoom-caption="Campanas virreinales de bronce fundido con vista panorámica hacia el cielo andahuaylino."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group mb-2"
            >
              <img
                src="/imagenes/imagenes historia/img168.jpg"
                alt="Campanas virreinales"
                className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>

            <p className="text-[10px] text-slate-600 font-serif italic text-center">
              Campanas de bronce que resuenan en la memoria colectiva de San Jerónimo.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Bronce Litúrgico</span>
            <span>— VI —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 7: EL UMBRAL Y LA CARPINTERÍA (Izquierda)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Capítulo III &bull; Portada y Umbral
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              El Portón Monumental
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              Un arco de medio punto enmarcado en cantería da paso al portón de madera noble tachonada, labrado por carpinteros virreinales como portal de transición entre el mundo exterior y el sagrado.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/IMG_20200926_172212553.jpg"
              data-zoom-title="Portón monumental y umbral sagrado"
              data-zoom-caption="Perspectiva desde el interior del templo a través del portón de madera hacia la plaza."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group mb-2"
            >
              <img
                src="/imagenes/imagenes historia/IMG_20200926_172212553.jpg"
                alt="Portón colonial"
                className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>

            <p className="text-[10px] text-slate-600 font-serif italic text-center">
              El umbral: umbral de bienvenida para generaciones de peregrinos.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Carpintería Colonial</span>
            <span>— VII —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 8: CLAVAZÓN Y HERRAJES DE BRONCE (Derecha)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Artes Mecánicas y Cincelado
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              Tachones y Aldabones
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              El portón está tachonado con clavos ornamentales de bronce fundido con motivos zoomorfos de aves y leones, testimonios del arte mestizo donde la orfebrería andina dialoga con el barroco español.
            </p>

            {/* Galería de dos detalles en miniatura */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div
                data-zoom-src="/imagenes/imagenes arqui/20220526120845_IMG_7203.JPG"
                data-zoom-title="Aldabón monumental de bronce"
                data-zoom-caption="Aldaba virreinal con follaje barroco y mascarón de león."
                className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
              >
                <img
                  src="/imagenes/imagenes arqui/20220526120845_IMG_7203.JPG"
                  alt="Aldaba barroca"
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white text-[8px] font-sans">
                  🔍 Aldaba
                </span>
              </div>

              <div
                data-zoom-src="/imagenes/imagenes arqui/20220526120148_IMG_7187.JPG"
                data-zoom-title="Tachón de bronce cincelado con figura de ave"
                data-zoom-caption="Clavazón virreinal de bronce con figura zoomorfa labrada en relieve."
                className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
              >
                <img
                  src="/imagenes/imagenes arqui/20220526120148_IMG_7187.JPG"
                  alt="Tachón de ave"
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white text-[8px] font-sans">
                  🔍 Tachón
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-600 font-serif italic text-center">
              Detalles de bronce forjado a mano que guarnecen el acceso principal.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Orfebrería y Bronce</span>
            <span>— VIII —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 9: EL RETABLO MAYOR EN PAN DE ORO (Izquierda)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Capítulo IV &bull; Presbiterio y Altar
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              El Retablo Mayor
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              En el ábside del templo resplandece el Retablo Mayor tallado en madera de cedro y revestido en láminas de pan de oro, presidido por la efigie de San Jerónimo Doctor y lienzos de la célebre Escuela Cusqueña.
            </p>

            <div
              data-zoom-src="/imagenes/retablo_mayor.jpg"
              data-zoom-title="Retablo Mayor en pan de oro"
              data-zoom-caption="Retablo barroco virreinal con columnas salomónicas y hornacinas doradas en el presbiterio."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group mb-2"
            >
              <img
                src="/imagenes/retablo_mayor.jpg"
                alt="Retablo Mayor"
                className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>

            <p className="text-[10px] text-slate-600 font-serif italic text-center">
              Retablo Mayor en pan de oro: cumbre devocional y artística del templo.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Retablo y Altar</span>
            <span>— IX —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 10: FE VIVA Y CUSTODIA PATRIMONIAL (Derecha)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-7 sm:p-9 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div>
            <div className="text-center pb-2 border-b border-[#c5a059]/40 mb-3">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-[#5e1224]">
                Patrimonio Vivo &bull; Siglo XXI
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-serif font-bold text-[#5e1224] mb-2 leading-tight">
              Fe y Esperanza que Continúan
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif mb-3">
              Hoy, cuatro siglos después de sus primeros cimientos, la Parroquia San Jerónimo continúa congregando a las familias en torno a la mesa de la Palabra y la Eucaristía, preservando su fe y custodiando su patrimonio con amor.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes arqui/14.jpg"
              data-zoom-title="Imagen tutelar de San Jerónimo Doctor"
              data-zoom-caption="Efigie colonial procesional de San Jerónimo con manto bordado en hilos de oro."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group mb-2"
            >
              <img
                src="/imagenes/imagenes arqui/14.jpg"
                alt="Imagen patronal de San Jerónimo"
                className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans">
                🔍 Ampliar
              </span>
            </div>

            <blockquote className="p-2 bg-[#5e1224]/5 border-l-2 border-[#5e1224] text-[10px] italic text-[#5e1224] font-serif">
              «Custodiar el templo es custodiar el alma de nuestro pueblo; en cada piedra labrada vive la fe de nuestros mayores.»
            </blockquote>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif">
            <span>Comunidad y Fe</span>
            <span>— X —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 11: CONTRAPORTADA DURA
            ============================================================== */}
        <div
          data-density="hard"
          className="w-full h-full p-8 sm:p-10 flex flex-col justify-between text-center select-none shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#3a0814] via-[#5e1224] to-[#6b1429] text-[#c5a059]"
        >
          {/* Doble Marco Ornamental Dorado */}
          <div className="absolute inset-3.5 border-2 border-[#c5a059] pointer-events-none rounded-lg" />
          <div className="absolute inset-5 border border-[#c5a059]/60 pointer-events-none rounded-sm" />

          {/* Encabezado de Contraportada */}
          <div className="relative z-10 pt-4">
            <span className="text-[10px] uppercase tracking-[0.25em] font-serif text-[#c5a059]/80">
              Finis Coronat Opus
            </span>
            <div className="w-12 h-0.5 bg-[#c5a059] mx-auto my-2" />
          </div>

          {/* Centro de Contraportada */}
          <div className="relative z-10 my-auto flex flex-col items-center">
            {/* Cruz Heráldica / Logo */}
            <div className="w-16 h-16 mb-3 p-1.5 rounded-full border border-[#c5a059] bg-[#5e1224]/80 flex items-center justify-center">
              <img
                src="/imagenes/logo navbar dorado.png"
                alt="Logo Parroquial"
                className="w-11 h-11 object-contain filter drop-shadow"
              />
            </div>

            <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wider uppercase mb-1">
              Parroquia San Jerónimo
            </h3>
            <p className="text-[11px] font-serif italic text-[#c5a059] mb-3">
              «Laetentur Caeli &bull; Alégrense los Cielos»
            </p>

            <div className="w-20 h-px bg-[#c5a059]/60 my-2" />

            <p className="text-[10px] text-slate-200/80 font-serif max-w-xs leading-relaxed">
              Diócesis de Abancay &bull; Andahuaylas, Apurímac<br />
              Este compendio histórico fue compilado para la memoria y edificación de la comunidad de fieles y visitantes.
            </p>
          </div>

          {/* Pie de Contraportada */}
          <div className="relative z-10 pb-4">
            <p className="text-[9px] uppercase tracking-widest text-[#c5a059]/70 font-serif">
              Deo Gratias &bull; A.D. 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreacionHistoriaSection
