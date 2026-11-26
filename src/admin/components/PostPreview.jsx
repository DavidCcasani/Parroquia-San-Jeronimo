// Réplicas fieles de cómo se muestra una publicación en el sitio público.
// El marcado copia las clases de EventosSection y FeaturedPostsSection
// (sin importarlos, para no modificar esos componentes).

const PLACEHOLDER = {
  titulo: 'Título de la publicación',
  categoria: 'Categoría',
  fecha: 'Fecha',
  hora: 'Horario',
  lugar: 'Lugar',
  resumen: 'El resumen aparecerá aquí. Escribe dos o tres líneas que inviten a leer más.',
}

const pick = (post, key) => (post[key] && String(post[key]).trim()) || PLACEHOLDER[key]

function IconCalendar({ className = 'w-3.5 h-3.5 shrink-0' }) {
  return (
    <svg
      className={className}
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
  )
}

function IconClock({ className = 'w-3.5 h-3.5 shrink-0' }) {
  return (
    <svg
      className={className}
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
  )
}

function IconMapPin({ className = 'w-3.5 h-3.5 shrink-0' }) {
  return (
    <svg
      className={className}
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
  )
}

function EmptyImage() {
  return (
    <div className="w-full h-full grid place-items-center bg-slate-200 text-slate-400 text-xs">
      Sin imagen
    </div>
  )
}

export function EventoCardPreview({ post, imageUrl }) {
  return (
    <article className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <EmptyImage />
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#5e1224]/90 backdrop-blur-xs text-[#c5a059] border border-[#c5a059]/40 shadow-sm">
            {pick(post, 'categoria')}
          </span>
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-xs text-[#5e1224] border border-[#c5a059]/50 shadow-md inline-flex items-center gap-1.5">
            <IconCalendar className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            <span>{pick(post, 'fecha')}</span>
          </span>
        </div>
        <div className="p-5" style={{ fontFamily: "'Roboto Slab', serif" }}>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 font-serif leading-snug">
            {pick(post, 'titulo')}
          </h3>
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <p className="flex items-center gap-1.5 truncate">
              <IconClock className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span>{pick(post, 'hora')}</span>
            </p>
            <p className="flex items-center gap-1.5 truncate">
              <IconMapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span>{pick(post, 'lugar')}</span>
            </p>
          </div>
          <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">{pick(post, 'resumen')}</p>
        </div>
      </div>
      <div className="p-5 pt-0 border-t border-slate-100 mt-2" style={{ fontFamily: "'Roboto Slab', serif" }}>
        <div className="w-full mt-3 py-2 px-4 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs">
          <span>Ver Información Completa</span>
          <span>&rarr;</span>
        </div>
      </div>
    </article>
  )
}

export function PortadaCardPreview({ post, imageUrl }) {
  return (
    <article
      className="h-full flex flex-col justify-between rounded-2xl bg-[#fffdfa] border border-[#c5a059]/35 shadow-md overflow-hidden text-slate-800"
      style={{ fontFamily: "'Roboto Slab', serif" }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> : <EmptyImage />}
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-md bg-[#5e1224] text-[#c5a059] border border-[#c5a059]/40 shadow-md flex items-center gap-1.5 text-xs font-serif font-bold tracking-wide">
          <IconCalendar className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
          <span>{pick(post, 'fecha')}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
      </div>
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#5e1224]">
              {pick(post, 'categoria')}
            </span>
            {post.etiqueta && (
              <span className="text-[9px] uppercase font-bold text-[#5e1224] bg-[#5e1224]/10 px-2 py-0.5 rounded-full border border-[#5e1224]/20">
                {post.etiqueta}
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
            {pick(post, 'titulo')}
          </h3>
          <p className="mt-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-2">
            {pick(post, 'resumen')}
          </p>
        </div>
        <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium truncate max-w-[140px] sm:max-w-[170px] inline-flex items-center gap-1.5">
            <IconMapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            <span className="truncate">{pick(post, 'lugar')}</span>
          </span>
          <span className="font-bold text-[#5e1224] inline-flex items-center gap-1">
            <span>Ver detalles</span>
            <span>&rarr;</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export function DetalleCardPreview({ post, imageUrl }) {
  return (
    <div
      className="rounded-3xl bg-white border-2 border-[#c5a059] shadow-2xl p-6 text-slate-800"
      style={{ fontFamily: "'Roboto Slab', serif" }}
    >
      <div className="relative h-56 rounded-2xl overflow-hidden mb-5 border border-slate-200 shadow-sm">
        {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> : <EmptyImage />}
        <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5e1224] text-[#c5a059] border border-[#c5a059]">
          {pick(post, 'categoria')}
        </span>
      </div>
      <h3 className="text-xl font-serif font-bold text-[#5e1224] leading-snug">{pick(post, 'titulo')}</h3>
      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-[#c5a059]/30 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-slate-400 font-semibold uppercase text-[10px]">Fecha</p>
          <p className="font-bold text-slate-800 text-sm inline-flex items-center gap-1.5 mt-0.5">
            <IconCalendar className="w-3.5 h-3.5 text-[#5e1224] shrink-0" />
            <span>{pick(post, 'fecha')}</span>
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase text-[10px]">Horario</p>
          <p className="font-bold text-slate-800 text-sm inline-flex items-center gap-1.5 mt-0.5">
            <IconClock className="w-3.5 h-3.5 text-[#5e1224] shrink-0" />
            <span>{pick(post, 'hora')}</span>
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-slate-400 font-semibold uppercase text-[10px]">Ubicación</p>
          <p className="font-bold text-slate-800 text-sm inline-flex items-center gap-1.5 mt-0.5">
            <IconMapPin className="w-3.5 h-3.5 text-[#5e1224] shrink-0" />
            <span>{pick(post, 'lugar')}</span>
          </p>
        </div>
        {post.organizador && (
          <div className="col-span-2 pt-2 border-t border-slate-200/70">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Organiza</p>
            <p className="font-medium text-slate-700">{post.organizador}</p>
          </div>
        )}
      </div>
      {post.descripcion && (
        <p className="mt-5 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-serif line-clamp-6">
          {post.descripcion}
        </p>
      )}
    </div>
  )
}
