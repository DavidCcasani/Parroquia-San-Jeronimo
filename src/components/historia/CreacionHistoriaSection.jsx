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
        <p className="mt-3 text-[11px] text-slate-500 text-center max-w-lg leading-relaxed inline-flex items-center justify-center gap-1.5 flex-wrap">
          <svg
            className="w-3.5 h-3.5 text-[#5e1224] shrink-0 inline"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>
            <strong>Lectura interactiva:</strong> Haz clic o arrastra las esquinas para pasar de página. El avance automático se detiene en cuanto interactúas con el libro.
          </span>
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
              Parroquia de San Jerónimo • Andahuaylas, Apurímac
            </span>
            <div className="w-16 h-0.5 bg-[#c5a059]/50 mx-auto my-2" />
          </div>

          {/* Cuerpo Central: Título Principal y Autor */}
          <div className="relative z-10 my-auto flex flex-col items-center px-3">
            <h1 className="text-xl sm:text-2xl lg:text-[24px] font-serif font-black tracking-wider uppercase text-white drop-shadow-md leading-tight mb-3">
              RESEÑA HISTÓRICA DEL TEMPLO COLONIAL DE SAN JERÓNIMO
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent my-2" />
            <p className="text-xs sm:text-sm font-serif text-[#c5a059] tracking-wide max-w-sm leading-relaxed mt-1">
              Julio César Samanez Moreno
            </p>
          </div>

          {/* Pie de Portada */}
          <div className="relative z-10 pb-4">
            <p className="text-[11px] sm:text-xs tracking-widest uppercase text-[#c5a059] font-serif font-semibold">
              Monumento Histórico del Perú • R.S. N.º 505-74-ED
            </p>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 1 (I): INTRODUCCIÓN Y ANTECEDENTES (1533 - 1539)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-3">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Reseña Histórica del Templo Colonial de San Jerónimo
              </span>
            </div>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif text-justify first-letter:text-2xl first-letter:font-bold first-letter:text-[#5e1224] first-letter:float-left first-letter:mr-1.5">
              El Templo Colonial de San Jerónimo, emplazado frente a la plaza principal del distrito de San Jerónimo, en la provincia de Andahuaylas, departamento de Apurímac, constituye uno de los testimonios más representativos de la historia religiosa, arquitectónica y cultural de esta localidad. Su presencia en el paisaje urbano, que se ha mantenido como referencia para la vida comunitaria a través de los siglos, invita a reconocer en sus muros, espacios litúrgicos, elementos ornamentales y expresiones de arte sacro no solamente una edificación de antigua tradición, sino también la memoria material y espiritual de un pueblo. El templo forma parte de la identidad jeronimiana y de una historia en la que la fe, la organización comunitaria, las celebraciones religiosas y la transmisión de costumbres han encontrado un espacio de continuidad.
            </p>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif text-justify">
              Los antecedentes de la parroquia de San Jerónimo podrían situarse en los primeros años de la presencia española en la región. En la obra <em>San Jerónimo el Mayor</em>, de don Américo Alvarado, se recoge una referencia atribuida al notable intelectual andahuaylino Humberto Urquizo Ocampos, quien plantea que la fundación de la parroquia habría ocurrido dentro del período comprendido entre el 17 de noviembre de 1533 y el 15 de abril de 1539, sin establecer una fecha exacta. Según la referencia que recoge Alvarado, dicho planteamiento habría sido publicado en una revista número 1, editada por Ángel Tarazona. Este dato constituye una aproximación que merece ser considerada dentro de la investigación histórica local, con la prudencia que exige la naturaleza de la fuente y la ausencia, hasta el momento, de una fecha definitiva. En consecuencia, conviene distinguir la posible fundación de la parroquia como institución eclesiástica de la construcción del edificio que hoy se conserva, puesto que el establecimiento parroquial y la fábrica material del templo pudieron corresponder a momentos diferentes de un proceso histórico más amplio.
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Antecedentes Históricos</span>
            <span>— I —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 2 (II): LA PARROQUIA TEMPRANA Y DATACIÓN HACIA 1600
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2.5">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Organización Religiosa y Datación
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              La referencia a una parroquia temprana permite aproximarnos al papel que la organización religiosa pudo desempeñar en la formación y consolidación del asentamiento. En el período colonial, las parroquias constituyeron espacios de culto, administración de sacramentos, enseñanza de la doctrina y articulación de la vida comunitaria. Sin atribuir al templo de San Jerónimo acontecimientos que todavía requieren comprobación documental, resulta posible comprender su historia dentro de ese contexto general, en el que la institución parroquial tuvo una importancia central en la vida cotidiana de las poblaciones. La historia precisa de sus primeros sacerdotes, sus bienes, sus cofradías, sus obras y sus sucesivas intervenciones arquitectónicas deberá seguir investigándose a través de registros parroquiales, documentos eclesiásticos, archivos y fuentes locales.
            </p>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              En cuanto a la edificación, la ficha de inventario turístico del Ministerio de Comercio Exterior y Turismo, MINCETUR, sitúa la construcción del templo aproximadamente hacia el año 1600. Esta datación constituye una referencia importante para comprender su antigüedad y su vinculación con la arquitectura religiosa de tradición colonial en la región, aunque no debe interpretarse como una fecha exacta para todos los elementos que integran el conjunto. Los templos históricos suelen ser resultado de diferentes etapas de construcción, adecuación, reparación, ornamentación y conservación, por lo que su configuración actual puede reunir componentes de diversas épocas. La aproximación cronológica consignada por el MINCETUR permite, por tanto, situar el edificio dentro de una perspectiva histórica, dejando abierta la posibilidad de precisar su evolución mediante investigaciones futuras.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/7.jpg"
              data-zoom-title="Templo Colonial de San Jerónimo y Plaza Principal"
              data-zoom-caption="Vista histórica del Templo Colonial de San Jerónimo emplazado frente a la plaza principal."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes historia/7.jpg"
                alt="Templo Colonial de San Jerónimo"
                className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                <span>Ampliar</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Edificación Colonial</span>
            <span>— II —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 3 (III): ARQUITECTURA, PIEDRA CHECCO Y FACHADA PIRAMIDAL
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2.5">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Arquitectura, Piedra Checco y Fachada
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              La arquitectura del templo revela el empleo de materiales y técnicas constructivas vinculadas a la tradición local. En la descripción recogida en el documento original, se destacan sus muros de adobe y piedra, así como el trabajo de piedra labrada presente en elementos de la fachada y el ingreso. La portada, que enmarca el acceso principal, incorpora un arco elaborado con piedra sillar, identificada localmente como piedra checco, cuya presencia aporta carácter y solidez a la composición exterior. La combinación de materiales, el tratamiento de los vanos, las proporciones de la fachada y la relación de la edificación con la plaza permiten apreciar la manera en que el templo se integra al espacio urbano, constituyendo una referencia visual y simbólica para la población.
            </p>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              La fachada presenta una composición que, de acuerdo con la descripción de base, se desarrolla con una disposición de carácter piramidal, en la que los elementos arquitectónicos contribuyen a dar jerarquía al acceso y a la estructura principal. Sus formas, materiales y detalles ornamentales reflejan una tradición constructiva que merece ser estudiada no solo desde la clasificación estilística, sino también desde la historia de las técnicas, los recursos disponibles y el trabajo de quienes participaron en su edificación y mantenimiento. En la lectura de su arquitectura es importante evitar atribuciones definitivas a maestros, talleres o estilos específicos cuando no se cuenta con documentación que los respalde, pero ello no impide reconocer la singularidad y el valor patrimonial de sus elementos.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/WhatsApp Image 2025-09-05 at 12.09.18 PM (3).jpeg"
              data-zoom-title="Fachada de disposición piramidal y portada en piedra checco"
              data-zoom-caption="Composición exterior del templo con portada de piedra sillar (piedra checco) y relación con el atrio."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes historia/WhatsApp Image 2025-09-05 at 12.09.18 PM (3).jpeg"
                alt="Fachada del templo"
                className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                <span>Ampliar</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Muros y Portada</span>
            <span>— III —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 4 (IV): ORIENTACIÓN Y TORRE ESPADAÑA EXENTA
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2.5">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Orientación y Torre Espadaña Exenta
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              La orientación de los templos cristianos ha sido objeto de interpretaciones litúrgicas y simbólicas a lo largo de la historia. En algunos casos, la disposición hacia el poniente o el oriente se relaciona con significados teológicos, prácticas rituales o tradiciones arquitectónicas. Para el caso específico del Templo de San Jerónimo, estas interpretaciones deben presentarse como referencias generales y no como explicaciones comprobadas de la decisión original de sus constructores, salvo que se encuentren documentos que así lo indiquen. Una reseña patrimonial rigurosa puede señalar el interés de su disposición arquitectónica, sin convertir las interpretaciones simbólicas en hechos históricos establecidos.
            </p>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              Entre los elementos más notables del conjunto se encuentra la torre espadaña exenta, levantada a un costado del templo y descrita por el MINCETUR como una estructura de piedra caliza organizada en dos niveles, con espacios para alojar campanas. Su presencia, separada de la edificación principal, constituye una característica distintiva del paisaje arquitectónico y religioso de San Jerónimo. La espadaña no solo cumple una función constructiva y visual, sino que se relaciona directamente con la vida litúrgica, pues desde ella se convoca a los fieles, se anuncian celebraciones y se marcan determinados momentos de la jornada y del calendario religioso.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/40.jpg"
              data-zoom-title="Torre espadaña exenta de piedra caliza"
              data-zoom-caption="Estructura exenta organizada en dos niveles a un costado del templo colonial."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes historia/40.jpg"
                alt="Torre espadaña exenta"
                className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                <span>Ampliar</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Torre Espadaña</span>
            <span>— IV —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 5 (V): LAS CAMPANAS HISTÓRICAS (1666 Y 1749)
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-3">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Las Campanas y la Memoria Colectiva
              </span>
            </div>

            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 font-serif text-justify">
              La ficha consultada del MINCETUR menciona tres campanas y recoge inscripciones en latín, además de fechas que se remontan a 1666 y 1749. En el documento original, sin embargo, se señala la existencia de cuatro campanas, por lo que este aspecto deberá cotejarse mediante una observación directa, fotografías, registros o una fuente documental adicional antes de fijar el número definitivo en una publicación. Las campanas, por su antigüedad y por su función dentro de las prácticas religiosas, constituyen bienes patrimoniales de especial interés. Sus sonidos han acompañado la vida de la comunidad, anunciando misas, festividades, solemnidades, procesiones y acontecimientos que forman parte de la memoria colectiva. Para numerosas generaciones, el repique de estas campanas ha sido una señal familiar, vinculada a la fe, a los encuentros comunitarios y a la experiencia cotidiana del pueblo.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/img168.jpg"
              data-zoom-title="Campanas históricas en la espadaña (1666 y 1749)"
              data-zoom-caption="Las campanas de la espadaña cuyo repique ha acompañado por siglos la vida de la comunidad jeronimiana."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes historia/img168.jpg"
                alt="Campanas del templo"
                className="w-full h-40 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                <span>Ampliar</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Campanas Patrimoniales</span>
            <span>— V —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 6 (VI): EL ALTAR MAYOR Y EL RETABLO EN PAN DE ORO
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2.5">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                El Altar Mayor y su Ornamentación
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              El interior del templo conserva elementos de arte religioso y ornamentación que contribuyen a su riqueza patrimonial. Sobresale el altar mayor, descrito en la ficha de inventario como tallado en madera y revestido de pan de oro, con rasgos ornamentales de tradición barroca y elementos que el registro interpreta con una inclinación hacia el neoclasicismo indígena. El retablo, por su composición, sus detalles y su presencia dentro del recinto, ocupa un lugar central en la organización del espacio litúrgico. Su valor no se limita a la riqueza visual o al trabajo artesanal, sino que se encuentra también en la función religiosa que ha desempeñado a lo largo del tiempo, como marco de la celebración eucarística y centro de atención y devoción de los fieles.
            </p>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              La ornamentación del altar mayor, sus formas, relieves, columnas, molduras y elementos dorados —en la medida en que estos se encuentren efectivamente presentes y puedan ser identificados en el conjunto— debe apreciarse como parte de un lenguaje artístico y religioso que buscó dignificar el espacio destinado al culto. La atribución estilística y la datación de cada componente requieren, sin embargo, un estudio específico que permita distinguir las características originales de las posibles modificaciones, repintes, reparaciones o intervenciones posteriores. El retablo constituye así un bien que merece tanto la apreciación de la comunidad como el estudio y la conservación especializada.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.10 AM (1).jpeg"
              data-zoom-title="Altar Mayor tallado en madera y revestido de pan de oro"
              data-zoom-caption="El retablo mayor en el interior del templo, centro del espacio litúrgico y de la devoción de los fieles."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.10 AM (1).jpeg"
                alt="Altar Mayor del templo"
                className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                <span>Ampliar</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Altar Mayor y Retablo</span>
            <span>— VI —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 7 (VII): ESCUELA CUSQUEÑA, PINTURA MURAL Y PUERTA TALLADA
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2.5">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Expresiones Pictóricas y Puerta Principal
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              La ficha patrimonial también hace referencia a lienzos vinculados a la tradición de la Escuela Cusqueña y a pinturas murales que forman parte de la decoración interior. Estas expresiones pictóricas enriquecen el espacio y permiten reconocer la presencia de un repertorio iconográfico religioso, cuya interpretación puede contribuir a comprender las prácticas devocionales, los modelos artísticos y las formas de representación que circularon en la región. La pintura mural, los lienzos, la escultura, los retablos y los elementos arquitectónicos forman parte de un conjunto integrado, por lo que su conservación exige atender tanto a cada pieza individual como a la relación que mantiene con el entorno del templo. La documentación de sus temas, materiales, técnicas, estado de conservación y posibles restauraciones sería un aporte valioso para futuras investigaciones.
            </p>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              La puerta principal de madera tallada y los detalles ornamentales que acompañan el ingreso completan la expresión arquitectónica del templo. La madera, la piedra, el adobe, la pintura y los elementos dorados se reúnen en un conjunto que refleja la adaptación de técnicas, materiales y recursos a la tradición local. El valor de estos componentes reside en su materialidad, en la calidad del trabajo artesanal y en la historia de uso y cuidado que han experimentado. En conjunto, fachada, portada, muros, espadaña, campanas, retablo, lienzos, pinturas murales y otros bienes religiosos conforman un patrimonio que no debe contemplarse de manera fragmentaria, sino como una expresión histórica y cultural vinculada al desarrollo de San Jerónimo.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/IMG_20200926_172212553.jpg"
              data-zoom-title="Puerta principal de madera tallada e ingreso al templo"
              data-zoom-caption="Vista del ingreso principal de madera tallada y arco de piedra que conecta el templo con la plaza."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes historia/IMG_20200926_172212553.jpg"
                alt="Puerta principal de madera tallada"
                className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                <span>Ampliar</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Arte Sacro y Portón</span>
            <span>— VII —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 8 (VIII): ALTARES, IMÁGENES Y ADVOCACIONES
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2.5">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Altares, Imágenes y Espacios de Devoción
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              El documento original identifica asimismo distintos altares, imágenes y espacios de devoción que forman parte de la vida interior del templo. Entre las advocaciones y representaciones señaladas se encuentran la Virgen de la Candelaria, San Jerónimo, San Francisco de Asís, San Antonio de Padua, Santa Rosa de Lima, San Martín de Porres y el Señor de la Resurrección; el Señor Justo Juez; la Virgen de Fátima; la Sagrada Familia de Nazaret, junto a San José, la Virgen María y el Niño Jesús de Reyes, además de la representación de la Santísima Trinidad; el Señor de Exaltación, acompañado por la Virgen Dolorosa y San Juan; San Josemaría Escrivá de Balaguer y el Niño Jesús de Praga; la Virgen del Carmen; la Virgen del Rosario; la Virgen Dolorosa y el Santo Sepulcro; así como el Señor de la Caída o Jesús Nazareno. Esta relación se recoge a partir de la descripción original y deberá cotejarse en cuanto a denominaciones, ubicación y disposición actual, con el propósito de que la reseña refleje fielmente el conjunto devocional.
            </p>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              Cada altar y cada imagen posee una significación particular dentro de la vida religiosa de la comunidad. Las advocaciones marianas, las representaciones de Cristo, los santos y las escenas de la Sagrada Familia expresan una diversidad de formas de veneración, oración y memoria. Estos espacios han podido ser escenario de promesas, agradecimientos, súplicas, celebraciones y encuentros personales con la fe, experiencias que muchas veces se transmiten en el ámbito familiar y comunitario. La historia de los altares no se reduce a su descripción física: también se relaciona con las devociones que los sostienen, con las prácticas litúrgicas, con los custodios y benefactores, y con las generaciones que han contribuido a su cuidado. Investigar la procedencia de las imágenes, sus fechas, autores, donaciones y restauraciones permitirá enriquecer esta parte de la historia con mayor precisión.
            </p>

            <div
              data-zoom-src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.11 AM.jpeg"
              data-zoom-title="Celebración litúrgica e imágenes devocionales en el altar"
              data-zoom-caption="Celebración eucarística en el presbiterio del Templo de San Jerónimo."
              className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
            >
              <img
                src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.11 AM.jpeg"
                alt="Celebración litúrgica en el altar"
                className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-sans inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                <span>Ampliar</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Advocaciones y Fe</span>
            <span>— VIII —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 9 (IX): VIDA RELIGIOSA, SOCIAL Y LUGAR DE MEMORIA
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2.5">
            <div className="text-center pb-2 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Vida Comunitaria y Lugar de Memoria
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              El templo ha sido, además, un escenario fundamental para la vida religiosa y social de San Jerónimo. En sus ambientes se han celebrado sacramentos que acompañan las distintas etapas de la vida: bautizos, matrimonios, celebraciones eucarísticas, momentos de oración, despedidas y otras expresiones de la vida cristiana. A través de las fiestas patronales, las procesiones, las solemnidades y las prácticas de religiosidad popular, el templo ha contribuido a mantener vínculos entre la parroquia y la población. Su historia se encuentra estrechamente relacionada con la experiencia de niños, jóvenes, adultos y ancianos, que han acudido a él por motivos de fe, tradición, necesidad espiritual o participación comunitaria.
            </p>

            <p className="text-[11px] leading-relaxed text-slate-700 font-serif text-justify">
              Para el pueblo jeronimiano, este espacio puede evocar recuerdos de infancia, la recepción de sacramentos, las festividades patronales, la oración junto a familiares, el repique de las campanas y la participación en las celebraciones que han marcado el calendario local. El templo, por tanto, es también un lugar de memoria: en él convergen experiencias individuales y colectivas que, aunque no siempre se encuentren registradas en documentos escritos, forman parte de la historia social y religiosa de la comunidad. La recogida responsable de testimonios orales, fotografías antiguas, recuerdos de celebraciones y relatos familiares podría contribuir a complementar la documentación histórica, distinguiendo siempre la memoria oral de los hechos que puedan corroborarse mediante fuentes documentales.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div
                data-zoom-src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.11 AM (1).jpeg"
                data-zoom-title="Participación comunitaria y trabajos en el templo"
                data-zoom-caption="Fotografía histórica del trabajo comunitario en el frontis y atrio del Templo de San Jerónimo."
                className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
              >
                <img
                  src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.11 AM (1).jpeg"
                  alt="Trabajo comunitario en el templo"
                  className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white text-[8px] font-sans inline-flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                  <span>Ampliar</span>
                </span>
              </div>

              <div
                data-zoom-src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.10 AM.jpeg"
                data-zoom-title="Conservación y cuidado de la fachada histórica"
                data-zoom-caption="Registro fotográfico de las labores de conservación en la fachada y cerco de piedra del templo."
                className="relative rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm cursor-pointer group"
              >
                <img
                  src="/imagenes/imagenes historia/WhatsApp Image 2026-11-26 at 11.08.10 AM.jpeg"
                  alt="Conservación de la fachada"
                  className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white text-[8px] font-sans inline-flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                  <span>Ampliar</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Memoria y Comunidad</span>
            <span>— IX —</span>
          </div>
        </div>

        {/* ==============================================================
            PÁGINA 10 (X): MONUMENTO HISTÓRICO, CONSERVACIÓN Y LEGADO
            ============================================================== */}
        <div
          data-density="soft"
          className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#fdfaf3] text-slate-800 relative overflow-hidden"
        >
          <div className="overflow-y-auto pr-1 space-y-2">
            <div className="text-center pb-1.5 border-b border-[#c5a059]/40">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.18em] text-[#5e1224]">
                Monumento Histórico y Compromiso Patrimonial
              </span>
            </div>

            <p className="text-[10.5px] leading-relaxed text-slate-700 font-serif text-justify">
              Su valor como patrimonio histórico se encuentra reconocido mediante su declaración como Monumento Histórico del Perú, a través de la Resolución Suprema N.º 505-74-ED, del 10 de octubre de 1974, según la información consignada en la ficha de inventario turístico consultada. Este reconocimiento constituye una referencia importante para su protección y conservación, y resalta la necesidad de preservar los valores arquitectónicos, artísticos, históricos y culturales que representa. La condición patrimonial implica una responsabilidad compartida: el cuidado cotidiano, la atención a los daños, la documentación de sus bienes y la realización de intervenciones con criterios técnicos adecuados, respetando los materiales, las características y la integridad del conjunto.
            </p>

            <p className="text-[10.5px] leading-relaxed text-slate-700 font-serif text-justify">
              La conservación del templo demanda el compromiso de la comunidad, de las autoridades, de las instituciones culturales y religiosas, así como de quienes investigan, documentan y difunden su historia. El registro de sus elementos arquitectónicos y artísticos, la revisión de fuentes, el estudio de los documentos parroquiales, la identificación de intervenciones anteriores y la recopilación de testimonios constituyen acciones que pueden fortalecer el conocimiento y la protección de este legado. Una reseña histórica no pretende cerrar la investigación, sino ofrecer una narración sustentada que reconozca los datos disponibles, señale las hipótesis con prudencia y deje abiertas las preguntas que aún requieren respuesta. En esa perspectiva, el templo continúa siendo objeto de interés histórico y patrimonial, cuyo estudio puede aportar nuevas luces sobre la trayectoria religiosa y cultural de San Jerónimo.
            </p>

            <p className="text-[10.5px] leading-relaxed text-slate-700 font-serif text-justify">
              El Templo Colonial de San Jerónimo reúne, en su arquitectura, sus bienes artísticos, sus altares, sus campanas y su vida litúrgica, una parte significativa de la historia del distrito. Los antecedentes de la parroquia, la hipótesis sobre su posible establecimiento entre 1533 y 1539, la referencia aproximada a la construcción hacia 1600, la espadaña, los elementos de piedra y madera, el retablo dorado, las pinturas y las imágenes devocionales conforman un legado que merece ser conocido y estudiado. Pero su significado no se agota en la antigüedad de sus muros ni en la descripción de sus componentes. Su valor más profundo se expresa en la memoria de las generaciones que han encontrado allí un lugar para celebrar, orar, agradecer, acompañarse y transmitir sus tradiciones.
            </p>

            <p className="text-[10.5px] leading-relaxed text-slate-700 font-serif text-justify">
              Conservar y difundir la historia del templo significa reconocer que este patrimonio es parte de la identidad jeronimiana y que su significado continúa renovándose en el presente. Es una herencia que enlaza el pasado con las generaciones actuales y futuras, que invita a valorar la historia local y a asumir la responsabilidad de proteger aquello que ha sido transmitido. Desde una mirada histórica, religiosa y patrimonial, el Templo de San Jerónimo no es únicamente una construcción antigua: es un testimonio de la fe, del trabajo, de la memoria y de la continuidad cultural de un pueblo, cuya historia merece ser escrita, investigada y compartida con respeto, rigor y profundo sentido de pertenencia.
            </p>

            <p className="pt-1 text-right text-xs font-serif font-bold text-[#5e1224]">
              Julio César Samanez Moreno
            </p>
          </div>

          <div className="pt-2 border-t border-[#c5a059]/30 flex justify-between items-center text-[10px] text-slate-500 font-serif shrink-0">
            <span>Patrimonio e Identidad</span>
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
              Reseña Histórica Patrimonial
            </span>
            <div className="w-12 h-0.5 bg-[#c5a059] mx-auto my-2" />
          </div>

          {/* Centro de Contraportada */}
          <div className="relative z-10 my-auto flex flex-col items-center px-3">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wider uppercase mb-1">
              Templo Colonial de San Jerónimo
            </h3>
            <p className="text-xs font-serif italic text-[#c5a059] mb-3">
              Texto: Julio César Samanez Moreno
            </p>

            <div className="w-20 h-px bg-[#c5a059]/60 my-2" />

            <p className="text-[10px] text-slate-200/80 font-serif max-w-xs leading-relaxed">
              Distrito de San Jerónimo • Provincia de Andahuaylas<br />
              Departamento de Apurímac, Perú
            </p>
          </div>

          {/* Pie de Contraportada */}
          <div className="relative z-10 pb-4">
            <p className="text-[9px] uppercase tracking-widest text-[#c5a059]/70 font-serif">
              Monumento Histórico del Perú • R.S. N.º 505-74-ED
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreacionHistoriaSection
