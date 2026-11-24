import { useRef, useState } from 'react'

const RADIO_STREAM_URL = 'https://dreamsiteradiocp6.com/proxy/rmperu?mp=/stream'

function FloatingBubbles() {
  const [activePanel, setActivePanel] = useState(null) // 'donar' | null
  const [isRadioExpanded, setIsRadioExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const audioRef = useRef(null)

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel))
  }

  const toggleRadioPlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setIsLoadingAudio(false)
    } else {
      setIsLoadingAudio(true)
      // Recargar el stream en vivo para evitar desfase de buffer
      audio.src = RADIO_STREAM_URL
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsLoadingAudio(false)
        })
        .catch(() => {
          setIsPlaying(false)
          setIsLoadingAudio(false)
        })
    }
  }

  return (
    <>
      {/* Elemento de audio real para la señal en vivo de Radio María Perú */}
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => {
          setIsPlaying(true)
          setIsLoadingAudio(false)
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false)
          setIsLoadingAudio(false)
        }}
      />

      {/* 1. Radio en Vivo: Debajo de Donar cuando está apagada; sube a la parte superior central cuando se reproduce */}
      <div
        className={`fixed z-40 select-none transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isPlaying || isLoadingAudio
            ? 'top-2.5 left-1/2 -translate-x-1/2 translate-y-0'
            : 'top-[calc(50%+3.25rem)] left-full -translate-x-[calc(100%+1.5rem)] -translate-y-1/2'
        }`}
      >
        <button
          type="button"
          onClick={toggleRadioPlay}
          className={`group flex items-center ${
            isPlaying || isLoadingAudio ? 'flex-row' : 'flex-row-reverse'
          } bg-[#5e1224] text-[#c5a059] rounded-full p-0 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
          aria-label={isPlaying ? 'Pausar Radio María Perú' : 'Reproducir Radio María Perú'}
        >
          {/* Logo de Radio María con el ícono de apagar/pausar encima de la imagen */}
          <div
            className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 transition-all duration-300 ${
              isPlaying || isLoadingAudio ? 'w-9 h-9' : 'w-11 h-11'
            }`}
          >
            <img
              src="/imagenes/logo radio maria.png"
              alt="Radio María"
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                isLoadingAudio
                  ? 'bg-black/45 opacity-100'
                  : isPlaying
                  ? 'bg-black/40 opacity-100'
                  : 'bg-black/30 opacity-0 group-hover:opacity-100'
              }`}
            >
              {isLoadingAudio ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <svg className="w-3.5 h-3.5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-white ml-0.5 drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>

          {/* Nombre de la radio: se queda visible arriba mientras se reproduce, o se despliega hacia la izquierda abajo en hover */}
          <span
            className={`overflow-hidden text-[11px] font-bold uppercase tracking-wider text-[#c5a059] whitespace-nowrap transition-all duration-300 ${
              isPlaying || isLoadingAudio
                ? 'max-w-xs pl-2.5 pr-3.5'
                : 'max-w-0 group-hover:max-w-xs group-hover:pl-3.5 group-hover:pr-2'
            }`}
          >
            {isLoadingAudio
              ? 'Conectando...'
              : isPlaying
              ? 'Radio María • En Vivo'
              : 'Radio María'}
          </span>
        </button>
      </div>

      {/* 2. Burbuja de Donar: En medio a la derecha */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-40 flex flex-col items-end gap-3 select-none">
        {activePanel === 'donar' && (
          <div className="mb-1 w-72 sm:w-80 rounded-2xl bg-white border-2 border-[#c5a059] shadow-2xl p-5 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5e1224]">
                Donar / Ofrenda Parroquial
              </h4>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="text-slate-400 hover:text-[#5e1224] text-xs font-bold cursor-pointer"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Tu colaboración ayuda al sostenimiento de las obras pastorales y conservación de nuestro templo histórico.
            </p>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-[#c5a059]/40">
                <p className="font-bold uppercase tracking-wider text-[#5e1224]">
                  Yape / Plin Parroquial
                </p>
                <p className="mt-1 text-slate-700 font-medium">+51 900 000 000</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-[#c5a059]/40">
                <p className="font-bold uppercase tracking-wider text-[#5e1224]">
                  Cuenta Bancaria
                </p>
                <p className="mt-1 text-slate-700">BCP: 000-0000000-0-00</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => togglePanel('donar')}
          className="group flex items-center flex-row-reverse bg-white text-[#c5a059] border-0 rounded-full p-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
          aria-label="Donar"
        >
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-[#5e1224] animate-heartbeat"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pl-3.5 group-hover:pr-1 text-xs font-bold uppercase tracking-wider text-[#c5a059] whitespace-nowrap transition-all duration-300">
            Donar
          </span>
        </button>
      </div>
    </>
  )
}

export default FloatingBubbles
