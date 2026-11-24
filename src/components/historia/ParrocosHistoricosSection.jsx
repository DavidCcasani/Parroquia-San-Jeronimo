import { PARROCOS_HISTORICOS } from './historiaData'

function ParrocosHistoricosSection({ onSelectImage }) {
  return (
    <div className="space-y-12">
      <div className="p-6 sm:p-12 rounded-3xl border-2 border-[#c5a059]/40 bg-white shadow-xs">
        {/* Encabezado de la sección */}
        <div className="border-b-2 border-[#c5a059]/20 pb-6 text-center max-w-2xl mx-auto">
          <h2
            style={{ fontFamily: "'Roboto Slab', serif" }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5e1224] leading-tight"
          >
            Camino Histórico de Nuestros Párrocos
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Recorrido cronológico por los pastores que han guiado la fe de la Parroquia de San Jerónimo. Haz clic en el retrato circular de cada párroco para ampliarlo.
          </p>
        </div>

        {/* CAMINO SERPENTEANTE VERTICAL (DE ARRIBA HACIA ABAJO) */}
        <div className="mt-12 max-w-4xl mx-auto relative">
          {PARROCOS_HISTORICOS.map((parroco, idx) => {
            const isEven = idx % 2 === 0
            const isLast = idx === PARROCOS_HISTORICOS.length - 1

            return (
              <div key={parroco.id} className="relative">
                {/* Fila del Párroco: Alterna Círculo Izquierda / Derecha como una culebra */}
                <div
                  className={`relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* MITAD DEL CÍRCULO (Centrado exactamente al 25% o 75% del contenedor) */}
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <div className="relative group">
                      {/* Halo decorativo exterior */}
                      <div className="absolute -inset-2.5 rounded-full transition-transform duration-500 group-hover:scale-105 bg-gradient-to-tr from-[#c5a059]/50 via-[#5e1224]/30 to-[#c5a059]/60" />

                      {/* Medallón Circular con la Foto del Párroco */}
                      <button
                        type="button"
                        onClick={() =>
                          onSelectImage({
                            src: parroco.photo,
                            title: parroco.name,
                            category: 'Biografía del Párroco',
                            caption: parroco.bio,
                          })
                        }
                        className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white ring-4 ring-[#c5a059] shadow-2xl cursor-pointer transition-transform duration-300 group-hover:scale-105 bg-slate-100 block"
                        title={`Ver retrato de ${parroco.name}`}
                      >
                        <img
                          src={parroco.photo}
                          alt={parroco.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-[#5e1224]/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full bg-white/95 text-[#5e1224] text-[11px] font-bold uppercase tracking-wider shadow inline-flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>Ver foto</span>
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* MITAD DE LA BIOGRAFÍA DEL PÁRROCO */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven ? 'md:pl-4 lg:pl-8' : 'md:pr-4 lg:pr-8'
                    }`}
                  >
                    <div className="p-6 sm:p-7 rounded-2xl border-2 border-[#c5a059]/40 bg-slate-50/70 text-slate-800 hover:border-[#c5a059] hover:bg-white shadow-sm transition-all relative">
                      <h3
                        style={{ fontFamily: "'Roboto Slab', serif" }}
                        className="text-lg sm:text-xl font-bold leading-snug text-[#5e1224]"
                      >
                        {parroco.name}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {parroco.bio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LAZO / CONECTOR SERPENTEANTE (CULEBRA) ENTRE ESTE CÍRCULO Y EL SIGUIENTE */}
                {!isLast && (
                  <div className="relative z-0 w-full h-24 sm:h-28 md:h-32 -my-3 pointer-events-none flex items-center justify-center">
                    {/* Curva en S para pantallas medianas y grandes */}
                    <svg
                      viewBox="0 0 1000 160"
                      preserveAspectRatio="none"
                      className="hidden md:block w-full h-full overflow-visible"
                    >
                      <defs>
                        <linearGradient
                          id={`snakeGrad-${idx}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#5e1224" />
                          <stop offset="50%" stopColor="#c5a059" />
                          <stop offset="100%" stopColor="#5e1224" />
                        </linearGradient>
                      </defs>

                      <path
                        d={
                          isEven
                            ? 'M 250 0 C 250 115, 750 45, 750 160'
                            : 'M 750 0 C 750 115, 250 45, 250 160'
                        }
                        fill="none"
                        stroke="#c5a059"
                        strokeOpacity="0.28"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />

                      <path
                        d={
                          isEven
                            ? 'M 250 0 C 250 115, 750 45, 750 160'
                            : 'M 750 0 C 750 115, 250 45, 250 160'
                        }
                        fill="none"
                        stroke={`url(#snakeGrad-${idx})`}
                        strokeWidth="6"
                        strokeLinecap="round"
                      />

                      <path
                        d={
                          isEven
                            ? 'M 250 0 C 250 115, 750 45, 750 160'
                            : 'M 750 0 C 750 115, 250 45, 250 160'
                        }
                        fill="none"
                        stroke="#f5efe1"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="500"
                        cy="80"
                        r="7"
                        fill="#c5a059"
                        stroke="#5e1224"
                        strokeWidth="2.5"
                      />
                    </svg>

                    {/* Curva serpenteante adaptada para móvil */}
                    <svg
                      viewBox="0 0 200 100"
                      className="block md:hidden w-40 h-full overflow-visible"
                    >
                      <path
                        d={
                          isEven
                            ? 'M 100 0 C 160 35, 40 65, 100 100'
                            : 'M 100 0 C 40 35, 160 65, 100 100'
                        }
                        fill="none"
                        stroke="#c5a059"
                        strokeOpacity="0.3"
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                      <path
                        d={
                          isEven
                            ? 'M 100 0 C 160 35, 40 65, 100 100'
                            : 'M 100 0 C 40 35, 160 65, 100 100'
                        }
                        fill="none"
                        stroke="#5e1224"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ParrocosHistoricosSection
