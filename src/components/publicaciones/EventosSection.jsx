import { useState } from 'react'
import { EVENTOS_PARROQUIALES, EVENTOS_CATEGORIAS } from '../../data/eventosData'

function EventosSection() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const filteredEvents =
    activeCategory === 'Todos'
      ? EVENTOS_PARROQUIALES
      : EVENTOS_PARROQUIALES.filter((evt) => evt.categoria === activeCategory)

  return (
    <div className="w-full">
      {/* Encabezado de la Sección */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a059]">
          Agenda y Actividades
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#5e1224] mt-1.5 font-serif">
          Eventos Parroquiales
        </h2>
        <div className="mt-3 mx-auto h-0.5 w-12 bg-[#c5a059]" />
        <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Acompaña a nuestra comunidad en sus celebraciones litúrgicas, retiros, actividades pastorales y obras de caridad en el valle.
        </p>
      </div>

      {/* Pestañas de Filtro por Categoría */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 select-none">
        {EVENTOS_CATEGORIAS.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#5e1224] text-[#c5a059] shadow-md border-2 border-[#c5a059]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Grilla de Eventos */}
      {filteredEvents.length === 0 ? (
        <div className="min-h-[30vh] rounded-2xl border-2 border-dashed border-[#c5a059]/40 bg-slate-50/50 p-10 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold text-slate-600">
            No se encontraron eventos en la categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory('Todos')}
            className="mt-3 text-xs font-bold text-[#5e1224] hover:underline cursor-pointer"
          >
            Ver todos los eventos &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((evento) => (
            <article
              key={evento.id}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200 hover:border-[#c5a059]/70 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div>
                {/* Imagen del Evento con badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={evento.imagen}
                    alt={evento.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge de Categoría */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#5e1224]/90 backdrop-blur-xs text-[#c5a059] border border-[#c5a059]/40 shadow-sm">
                    {evento.categoria}
                  </span>

                  {/* Badge de Fecha */}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-xs text-[#5e1224] border border-[#c5a059]/50 shadow-md inline-flex items-center gap-1.5">
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
                    <span>{evento.fecha}</span>
                  </span>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#5e1224] transition-colors line-clamp-2 font-serif leading-snug">
                    {evento.titulo}
                  </h3>

                  {/* Meta: Hora y Lugar */}
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5 truncate">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{evento.hora}</span>
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
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
                      <span>{evento.lugar}</span>
                    </p>
                  </div>

                  {/* Resumen */}
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {evento.resumen}
                  </p>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(evento)}
                  className="w-full mt-3 py-2 px-4 rounded-xl bg-slate-50 hover:bg-[#5e1224] text-slate-700 hover:text-white border border-slate-200 hover:border-[#5e1224] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <span>Ver Información Completa</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODAL DE DETALLE DEL EVENTO */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border-2 border-[#c5a059] shadow-2xl p-6 sm:p-8 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de Cierre */}
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-[#5e1224] hover:text-white text-slate-600 transition-colors flex items-center justify-center text-sm font-bold cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {/* Cabecera con Imagen */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-5 border border-slate-200 shadow-sm">
              <img
                src={selectedEvent.imagen}
                alt={selectedEvent.titulo}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5e1224] text-[#c5a059] border border-[#c5a059]">
                {selectedEvent.categoria}
              </span>
            </div>

            {/* Título */}
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#5e1224] leading-snug">
              {selectedEvent.titulo}
            </h3>

            {/* Ficha de Detalles (Fecha, Hora, Lugar, Organizador) */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-[#c5a059]/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Fecha</p>
                <p className="font-bold text-slate-800 text-sm inline-flex items-center gap-1.5 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 text-[#5e1224] shrink-0"
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
                  <span>{selectedEvent.fecha}</span>
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Horario</p>
                <p className="font-bold text-slate-800 text-sm inline-flex items-center gap-1.5 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 text-[#5e1224] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{selectedEvent.hora}</span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Ubicación</p>
                <p className="font-bold text-slate-800 text-sm inline-flex items-center gap-1.5 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 text-[#5e1224] shrink-0"
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
                  <span>{selectedEvent.lugar}</span>
                </p>
              </div>
              {selectedEvent.organizador && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/70">
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Organiza</p>
                  <p className="font-medium text-slate-700">{selectedEvent.organizador}</p>
                </div>
              )}
            </div>

            {/* Descripción Completa */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5e1224] mb-2">
                Descripción de la Actividad
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                {selectedEvent.descripcion}
              </p>
            </div>

            {/* Pie del Modal */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-xl bg-[#5e1224] hover:bg-[#480d1b] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventosSection
