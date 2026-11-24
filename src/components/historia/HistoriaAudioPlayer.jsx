import { useEffect, useRef, useState } from 'react'

function HistoriaAudioPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.45

    // Intentar reproducir al entrar a /historia
    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }

    tryPlay()

    // Si el navegador bloqueó el autoplay en la recarga directa, activar al primer clic o scroll
    const unlockOnInteraction = () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true)
          })
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

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/historia.mp3" loop preload="auto" />

      {/* Control flotante discreto en la esquina inferior izquierda */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#5e1224] text-white border-2 border-[#c5a059] shadow-xl hover:bg-[#480d1b] transition-all cursor-pointer"
          title={isPlaying ? 'Pausar música histórica' : 'Reproducir música histórica'}
        >
          {/* Icono de barras de sonido o play */}
          {isPlaying && !isMuted ? (
            <span className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 h-3.5 bg-[#c5a059] animate-pulse rounded-full" />
              <span className="w-0.5 h-2.5 bg-[#c5a059] animate-pulse rounded-full" />
              <span className="w-0.5 h-3 bg-[#c5a059] animate-pulse rounded-full" />
            </span>
          ) : (
            <svg
              className="w-3.5 h-3.5 text-[#c5a059]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}

          <span className="text-xs font-semibold tracking-wider uppercase text-[#c5a059]">
            {isPlaying ? 'Ambiente Sacro' : 'Escuchar Himno'}
          </span>
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-[#5e1224] border-2 border-[#c5a059] shadow-lg flex items-center justify-center hover:bg-[#5e1224] hover:text-[#c5a059] transition-all cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        )}
      </div>
    </>
  )
}

export default HistoriaAudioPlayer
