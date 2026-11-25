function Footer({ onNavigate }) {
  const handleNav = (e, path) => {
    if (onNavigate) {
      onNavigate(e, path)
    }
  }

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full bg-[#3d0b17] text-[#f5efe6] relative select-none">
      {/* Filete editorial superior: Doble línea fina dorada sin sombras ni degradados */}
      <div className="w-full border-t border-[#c5a059]/60 pb-0.5 border-b border-[#c5a059]/30" />

      {/* Contenedor principal: Proporciones 5 / 4 / 3 en escritorio */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* ==============================================================
              BLOQUE 1: IDENTIDAD (5 columnas)
              ============================================================== */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <a
                href="/"
                onClick={(e) => handleNav(e, '/')}
                className="inline-flex items-center gap-4 group cursor-pointer"
              >
                <img
                  src="/imagenes/logo principal dorado.png"
                  alt="Escudo Parroquia San Jerónimo"
                  className="h-16 w-auto object-contain shrink-0"
                />
                <div>
                  <h3
                    style={{ fontFamily: "'Roboto Slab', serif" }}
                    className="text-lg sm:text-xl font-bold tracking-wider text-[#f5efe6] uppercase leading-tight group-hover:text-[#c5a059] transition-colors"
                  >
                    Parroquia San Jerónimo
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#c5a059] font-medium block mt-1">
                    Diócesis de Abancay &bull; Templo Matriz
                  </span>
                </div>
              </a>

              <p className="mt-5 text-xs sm:text-[13px] text-[#f5efe6]/75 font-serif leading-relaxed max-w-md">
                Monumento histórico virreinal de los siglos XVI–XVII en el corazón del valle del Chumbao. Casa de fe, comunión sacramental y memoria viva del pueblo andino.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#c5a059]/20 text-xs text-[#f5efe6]/70 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#c5a059] font-bold block">
                Ubicación Canónica y Monumental
              </span>
              <p className="leading-relaxed">
                Plaza de Armas de San Jerónimo s/n, Andahuaylas, Apurímac, Perú
              </p>
            </div>
          </div>

          {/* ==============================================================
              BLOQUE 2: ÍNDICE DE NAVEGACIÓN (4 columnas divididas en 2)
              ============================================================== */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Subcolumna 1: La Parroquia */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c5a059] block mb-4 border-b border-[#c5a059]/20 pb-1.5">
                La Parroquia
              </span>
              <ul className="space-y-3 text-xs sm:text-[13px] text-[#f5efe6]/80 font-serif">
                <li>
                  <a
                    href="/historia/creacion"
                    onClick={(e) => handleNav(e, '/historia/creacion')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Historia
                  </a>
                </li>
                <li>
                  <a
                    href="/historia/arquitectura"
                    onClick={(e) => handleNav(e, '/historia/arquitectura')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Arquitectura
                  </a>
                </li>
                <li>
                  <a
                    href="/historia/parrocos"
                    onClick={(e) => handleNav(e, '/historia/parrocos')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Párrocos
                  </a>
                </li>
                <li>
                  <a
                    href="/galeria"
                    onClick={(e) => handleNav(e, '/galeria')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Galería
                  </a>
                </li>
              </ul>
            </div>

            {/* Subcolumna 2: Vida Pastoral */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c5a059] block mb-4 border-b border-[#c5a059]/20 pb-1.5">
                Vida Pastoral
              </span>
              <ul className="space-y-3 text-xs sm:text-[13px] text-[#f5efe6]/80 font-serif">
                <li>
                  <a
                    href="/tramites/bautismo"
                    onClick={(e) => handleNav(e, '/tramites/bautismo')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Trámites
                  </a>
                </li>
                <li>
                  <a
                    href="/publicaciones/eventos"
                    onClick={(e) => handleNav(e, '/publicaciones/eventos')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Eventos
                  </a>
                </li>
                <li>
                  <a
                    href="/servicios"
                    onClick={(e) => handleNav(e, '/servicios')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Servicios
                  </a>
                </li>
                <li>
                  <a
                    href="/festividades"
                    onClick={(e) => handleNav(e, '/festividades')}
                    className="hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline decoration-[#c5a059]/60"
                  >
                    Festividades
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ==============================================================
              BLOQUE 3: ATENCIÓN Y DESPACHO (3 columnas)
              ============================================================== */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c5a059] block mb-4 border-b border-[#c5a059]/20 pb-1.5">
                Atención y Despacho
              </span>

              <div className="space-y-1.5 text-xs text-[#f5efe6]/80 font-sans">
                <span className="text-[10px] uppercase tracking-wider text-[#c5a059] font-bold block">
                  Horario de Secretaría
                </span>
                <p className="leading-relaxed">
                  Lunes a Sábado<br />
                  9:00 AM – 1:00 PM<br />
                  3:00 PM – 6:00 PM
                </p>
                <p className="text-[11px] text-[#c5a059]/90 italic font-serif pt-1">
                  Domingos: Atención previa a las Misas
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#c5a059]/20">
                <span className="text-[10px] uppercase tracking-wider text-[#c5a059] font-bold block">
                  Teléfono Parroquial
                </span>
                <a
                  href="tel:+51984123456"
                  className="mt-1 text-xs sm:text-[13px] text-[#f5efe6] font-medium hover:text-[#c5a059] transition-colors inline-block tracking-wide underline-offset-4 hover:underline decoration-[#c5a059]/60"
                >
                  +51 984 123 456
                </a>
              </div>
            </div>

            {/* Canales Oficiales: Enlaces tipográficos limpios con íconos monocromáticos sin círculos de fondo */}
            <div className="mt-6 pt-3.5 border-t border-[#c5a059]/20 flex items-center gap-4 text-xs">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f5efe6]/80 hover:text-[#c5a059] transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline decoration-[#c5a059]/60"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>

              <span className="text-[#c5a059]/40 select-none">•</span>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f5efe6]/80 hover:text-[#c5a059] transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline decoration-[#c5a059]/60"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* ==============================================================
            BARRA INFERIOR (COLOFÓN)
            ============================================================== */}
        <div className="mt-14 sm:mt-16 pt-6 border-t border-[#c5a059]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f5efe6]/70">
          <p className="tracking-wide text-center sm:text-left">
            &copy; 2026 Parroquia de San Jerónimo — Andahuaylas, Perú.
          </p>

          <button
            type="button"
            onClick={handleScrollTop}
            className="inline-flex items-center gap-1.5 text-[#c5a059] hover:text-[#f5efe6] transition-colors cursor-pointer underline-offset-4 hover:underline decoration-[#c5a059]/60 font-medium"
          >
            <span>Volver arriba</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
