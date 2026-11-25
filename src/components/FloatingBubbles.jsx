import { useEffect, useRef, useState } from 'react'

const RADIO_STREAM_URL = 'https://dreamsiteradiocp6.com/proxy/rmperu?mp=/stream'

const CONTACT_PHONES = [
  {
    id: 'secretaria',
    title: 'Secretaría Parroquial',
    phone: '+51 984 123 456',
    cleanPhone: '+51984123456',
    waNumber: '51984123456',
    waMessage: 'Hola, me comunico con la Secretaría de la Parroquia San Jerónimo para realizar una consulta.',
    schedule: 'Lun - Sáb: 9:00 AM - 1:00 PM / 3:00 PM - 6:00 PM',
    badge: 'Atención General',
  },
  {
    id: 'despacho',
    title: 'Despacho y Trámites',
    phone: '+51 984 234 567',
    cleanPhone: '+51984234567',
    waNumber: '51984234567',
    waMessage: 'Hola, me comunico con el Despacho Parroquial de San Jerónimo para consultar sobre trámites y sacramentos.',
    schedule: 'Bautismos, Matrimonios y Constancias',
    badge: 'Trámites',
  },
  {
    id: 'emergencias',
    title: 'Emergencias Pastorales',
    phone: '+51 984 345 678',
    cleanPhone: '+51984345678',
    waNumber: '51984345678',
    waMessage: 'Hola, me comunico por una urgencia pastoral / unción de enfermos con la Parroquia San Jerónimo.',
    schedule: 'Unción de enfermos y urgencias (24h)',
    badge: 'Urgencias 24h',
  },
]

function FloatingBubbles() {
  const [activePanel, setActivePanel] = useState(null) // 'donar' | 'contacto' | null
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  const audioRef = useRef(null)
  const panelRef = useRef(null)
  const buttonsRef = useRef(null)

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel))
  }

  const handleCopy = (text, fieldId) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedField(fieldId)
          setTimeout(() => {
            setCopiedField((prev) => (prev === fieldId ? null : prev))
          }, 2000)
        })
        .catch(() => {})
    }
  }

  // Cerrar el popover al hacer clic fuera del panel y de la columna de botones
  useEffect(() => {
    if (!activePanel) return
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonsRef.current &&
        !buttonsRef.current.contains(e.target)
      ) {
        setActivePanel(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [activePanel])

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

      {/* 1. Modal / Popover Flotante (Donar o Contacto) */}
      {activePanel && (
        <div
          ref={panelRef}
          className="fixed right-16 sm:right-20 top-1/2 -translate-y-1/2 z-50 w-[calc(100vw-5rem)] max-w-xs sm:max-w-sm sm:w-88 max-h-[88vh] overflow-y-auto rounded-2xl bg-white border-2 border-[#c5a059] shadow-2xl p-5 text-slate-800 transition-all duration-300"
        >
          {/* Panel de Donar */}
          {activePanel === 'donar' && (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5e1224]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5e1224]">
                    Donar / Ofrenda Parroquial
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-[#5e1224] hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Tu colaboración voluntaria ayuda al sostenimiento de las obras pastorales, la caridad cristiana y la conservación de nuestro templo patrimonial.
              </p>

              {/* Sección Yape / Plin */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50/90 border border-[#c5a059]/40 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Badge Yape */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#742284] text-white shadow-xs">
                      Yape
                    </span>
                    {/* Badge Plin */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#00D1C1] text-white shadow-xs">
                      Plin
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Billetera Móvil
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-500">Número Parroquial:</p>
                    <p className="text-xs font-bold text-slate-800 tracking-wider font-mono">+51 900 000 000</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('+51 900 000 000', 'yape')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      copiedField === 'yape'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-[#5e1224] hover:text-white text-slate-700 border border-slate-200'
                    }`}
                    title="Copiar número de Yape/Plin"
                  >
                    {copiedField === 'yape' ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500">
                  Titular: <span className="font-semibold text-slate-700">Parroquia San Jerónimo</span>
                </p>
              </div>

              {/* Sección Cuenta Bancaria BCP */}
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50/90 border border-[#c5a059]/40 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {/* Badge BCP */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#002A8F] text-white shadow-xs">
                      BCP
                      <span className="text-[#FF7800] ml-0.5">›</span>
                    </span>
                    <span className="text-[11px] font-bold text-[#5e1224]">
                      Banco de Crédito
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Cta. Corriente
                  </span>
                </div>

                {/* Número de Cuenta */}
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-500">N° de Cuenta:</p>
                    <p className="text-xs font-bold text-slate-800 tracking-wider font-mono">000-0000000-0-00</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('000-0000000-0-00', 'bcp-cta')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      copiedField === 'bcp-cta'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-[#5e1224] hover:text-white text-slate-700 border border-slate-200'
                    }`}
                    title="Copiar número de cuenta BCP"
                  >
                    {copiedField === 'bcp-cta' ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Código de Cuenta Interbancario (CCI) */}
                <div className="flex items-center justify-between gap-2 mt-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-500">CCI (Interbancario):</p>
                    <p className="text-[11px] font-bold text-slate-800 tracking-wider font-mono">002-00000000000000-00</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('002-00000000000000-00', 'bcp-cci')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      copiedField === 'bcp-cci'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-[#5e1224] hover:text-white text-slate-700 border border-slate-200'
                    }`}
                    title="Copiar CCI interbancario"
                  >
                    {copiedField === 'bcp-cci' ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-[10px] text-slate-500">
                  Titular: <span className="font-semibold text-slate-700">Parroquia San Jerónimo</span>
                </p>
              </div>

              <p className="mt-3 text-[10px] text-center text-slate-500 italic">
                Que Dios bendiga con abundancia tu generosidad.
              </p>
            </div>
          )}

          {/* Panel de Contacto Parroquial */}
          {activePanel === 'contacto' && (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5e1224]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5e1224]">
                    Contacto Parroquial
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-[#5e1224] hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Estamos a tu disposición. Puedes comunicarte directamente con nuestras líneas de atención pastoral o escribirnos vía WhatsApp.
              </p>

              {/* Lista de Teléfonos */}
              <div className="mt-3.5 space-y-2.5">
                {CONTACT_PHONES.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50/90 border border-[#c5a059]/40 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-bold text-[#5e1224] uppercase tracking-wider">
                        {item.title}
                      </p>
                      <span className="inline-block text-[9px] font-semibold text-[#c5a059] bg-[#5e1224]/5 px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                        {item.badge}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-slate-500 leading-tight">
                      {item.schedule}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-1.5 pt-2 border-t border-slate-200/70">
                      <a
                        href={`tel:${item.cleanPhone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#5e1224] transition-colors"
                        title="Llamar directamente"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#5e1224]/10 text-[#5e1224] flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                        <span className="font-mono tracking-tight text-[11px] sm:text-xs">{item.phone}</span>
                      </a>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Botón individual de WhatsApp */}
                        <a
                          href={`https://wa.me/${item.waNumber}?text=${encodeURIComponent(item.waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
                          title={`Escribir a WhatsApp (${item.title})`}
                        >
                          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.188 8.188 0 01-5.82 2.41c-1.42 0-2.82-.37-4.06-1.07l-.29-.16-3.03.79.81-2.95-.19-.3a8.17 8.17 0 01-1.25-4.32c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.61.2 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z" />
                          </svg>
                          <span>WhatsApp</span>
                        </a>

                        {/* Botón de Copiar */}
                        <button
                          type="button"
                          onClick={() => handleCopy(item.phone, item.id)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                            copiedField === item.id
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200/80 hover:bg-[#5e1224] hover:text-white text-slate-600'
                          }`}
                          title="Copiar número"
                        >
                          {copiedField === item.id ? (
                            <>
                              <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Columna de Botones Flotantes (Donar y Contacto) */}
      <div
        ref={buttonsRef}
        className="fixed top-1/2 -translate-y-1/2 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 select-none"
      >
        {/* Botón Flotante: Donar */}
        <button
          type="button"
          onClick={() => togglePanel('donar')}
          className={`group flex items-center flex-row-reverse rounded-full p-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
            activePanel === 'donar'
              ? 'bg-[#5e1224] text-[#c5a059] ring-2 ring-[#c5a059]'
              : 'bg-white text-[#c5a059]'
          }`}
          aria-label="Donar u Ofrenda Parroquial"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
              activePanel === 'donar' ? 'bg-[#5e1224]' : 'bg-white'
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                activePanel === 'donar' ? 'text-[#c5a059]' : 'text-[#5e1224] animate-heartbeat'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <span
            className={`max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pl-3.5 group-hover:pr-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              activePanel === 'donar' ? 'text-[#c5a059]' : 'text-[#c5a059]'
            }`}
          >
            Donar
          </span>
        </button>

        {/* Botón Flotante: Contactos */}
        <button
          type="button"
          onClick={() => togglePanel('contacto')}
          className={`group flex items-center flex-row-reverse rounded-full p-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
            activePanel === 'contacto'
              ? 'bg-[#5e1224] text-[#c5a059] ring-2 ring-[#c5a059]'
              : 'bg-white text-[#5e1224]'
          }`}
          aria-label="Contactos Parroquiales"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
              activePanel === 'contacto' ? 'bg-[#5e1224]' : 'bg-white'
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                activePanel === 'contacto' ? 'text-[#c5a059]' : 'text-[#5e1224]'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <span
            className={`max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pl-3.5 group-hover:pr-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              activePanel === 'contacto' ? 'text-[#c5a059]' : 'text-[#5e1224]'
            }`}
          >
            Contacto
          </span>
        </button>
      </div>

      {/* 3. Botón Flotante: Radio María (Debajo de Contactos cuando está apagada; sube a la cabecera central cuando se reproduce) */}
      <div
        className={`fixed z-40 select-none transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isPlaying || isLoadingAudio
            ? 'top-2.5 left-1/2 -translate-x-1/2 translate-y-0'
            : 'top-[calc(50%+5.25rem)] right-4 sm:right-6 -translate-y-1/2'
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

          {/* Nombre de la radio */}
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
    </>
  )
}

export default FloatingBubbles
