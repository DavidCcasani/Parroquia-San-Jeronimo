import { useState, useRef, useEffect } from 'react'
import {
  NAV_ROUTES,
  HISTORIA_SUBROUTES,
  TRAMITES_SUBROUTES,
  PUBLICACIONES_SUBROUTES,
} from '../constants/routes'

function Navbar({
  navRef,
  isHome,
  navIsWhite,
  currentPath,
  onNavigate,
}) {
  const [historiaOpen, setHistoriaOpen] = useState(false)
  const [tramitesOpen, setTramitesOpen] = useState(false)
  const [publicacionesOpen, setPublicacionesOpen] = useState(false)
  const historiaDropdownRef = useRef(null)
  const tramitesDropdownRef = useRef(null)
  const publicacionesDropdownRef = useRef(null)

  const lowerPath = (currentPath || '/').toLowerCase()

  // Cerrar al hacer clic fuera de los dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        historiaDropdownRef.current &&
        !historiaDropdownRef.current.contains(e.target)
      ) {
        setHistoriaOpen(false)
      }
      if (
        tramitesDropdownRef.current &&
        !tramitesDropdownRef.current.contains(e.target)
      ) {
        setTramitesOpen(false)
      }
      if (
        publicacionesDropdownRef.current &&
        !publicacionesDropdownRef.current.contains(e.target)
      ) {
        setPublicacionesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-30 w-full transition-colors duration-300 ${
        isHome ? '-mt-16' : ''
      } ${
        navIsWhite
          ? 'bg-white text-slate-900 border-b border-slate-200 shadow-sm'
          : 'bg-black/35 text-white border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => onNavigate(e, '/')}
          className="flex items-center"
        >
          <img
            src="/imagenes/logo navbar dorado.png"
            alt="Parroquia de San Jerónimo"
            className="h-10 sm:h-11 w-auto object-contain transition-all duration-300"
          />
        </a>
        <ul className="flex items-center gap-4 lg:gap-5 xl:gap-7 text-xs lg:text-sm font-semibold uppercase tracking-wider text-[#c5a059] flex-wrap justify-end">
          {NAV_ROUTES.map((route) => {
            const isActiveRoute =
              lowerPath === route.path ||
              lowerPath.startsWith(`${route.path}/`)

            if (route.path === '/historia') {
              return (
                <li
                  key={route.path}
                  ref={historiaDropdownRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setTramitesOpen(false)
                      setPublicacionesOpen(false)
                      setHistoriaOpen((prev) => !prev)
                    }}
                    className={`transition-colors pb-1 whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider ${
                      isActiveRoute
                        ? 'text-[#5e1224] border-b-2 border-[#c5a059]'
                        : navIsWhite
                        ? 'hover:text-[#5e1224]'
                        : 'hover:text-white'
                    }`}
                  >
                    <span>{route.label}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        historiaOpen ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 12 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 1.5 6 6.5l5-5" />
                    </svg>
                  </button>

                  {/* Menú Desplegable con las sub-rutas de Historia */}
                  {historiaOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-[#c5a059] py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      {HISTORIA_SUBROUTES.map((chap) => {
                        const isSubActive =
                          lowerPath === chap.path.toLowerCase()
                        return (
                          <a
                            key={chap.id}
                            href={chap.path}
                            onClick={(e) => {
                              e.stopPropagation()
                              setHistoriaOpen(false)
                              onNavigate(e, chap.path)
                            }}
                            className={`w-full text-left px-5 py-2.5 transition-colors block text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                              isSubActive
                                ? 'bg-[#5e1224] text-[#c5a059]'
                                : 'hover:bg-[#5e1224]/10 hover:text-[#5e1224]'
                            }`}
                          >
                            <span className="whitespace-nowrap">
                              {chap.label}
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  )}
                </li>
              )
            }

            if (route.path === '/tramites') {
              return (
                <li
                  key={route.path}
                  ref={tramitesDropdownRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setHistoriaOpen(false)
                      setPublicacionesOpen(false)
                      setTramitesOpen((prev) => !prev)
                    }}
                    className={`transition-colors pb-1 whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider ${
                      isActiveRoute
                        ? 'text-[#5e1224] border-b-2 border-[#c5a059]'
                        : navIsWhite
                        ? 'hover:text-[#5e1224]'
                        : 'hover:text-white'
                    }`}
                  >
                    <span>{route.label}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        tramitesOpen ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 12 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 1.5 6 6.5l5-5" />
                    </svg>
                  </button>

                  {/* Menú Desplegable con las sub-rutas de Trámites */}
                  {tramitesOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-[#c5a059] py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      {TRAMITES_SUBROUTES.map((opt) => {
                        const isSubActive =
                          lowerPath === opt.path.toLowerCase()
                        return (
                          <a
                            key={opt.id}
                            href={opt.path}
                            onClick={(e) => {
                              e.stopPropagation()
                              setTramitesOpen(false)
                              onNavigate(e, opt.path)
                            }}
                            className={`w-full text-left px-5 py-2.5 transition-colors block text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                              isSubActive
                                ? 'bg-[#5e1224] text-[#c5a059]'
                                : 'hover:bg-[#5e1224]/10 hover:text-[#5e1224]'
                            }`}
                          >
                            <span className="whitespace-nowrap">
                              {opt.label}
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  )}
                </li>
              )
            }

            if (route.path === '/publicaciones') {
              return (
                <li
                  key={route.path}
                  ref={publicacionesDropdownRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setHistoriaOpen(false)
                      setTramitesOpen(false)
                      setPublicacionesOpen((prev) => !prev)
                    }}
                    className={`transition-colors pb-1 whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider ${
                      isActiveRoute
                        ? 'text-[#5e1224] border-b-2 border-[#c5a059]'
                        : navIsWhite
                        ? 'hover:text-[#5e1224]'
                        : 'hover:text-white'
                    }`}
                  >
                    <span>{route.label}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        publicacionesOpen ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 12 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 1.5 6 6.5l5-5" />
                    </svg>
                  </button>

                  {/* Menú Desplegable con las sub-rutas de Publicaciones */}
                  {publicacionesOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-[#c5a059] py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      {PUBLICACIONES_SUBROUTES.map((pub) => {
                        const isSubActive =
                          lowerPath === pub.path.toLowerCase()
                        return (
                          <a
                            key={pub.id}
                            href={pub.path}
                            onClick={(e) => {
                              e.stopPropagation()
                              setPublicacionesOpen(false)
                              onNavigate(e, pub.path)
                            }}
                            className={`w-full text-left px-5 py-2.5 transition-colors block text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                              isSubActive
                                ? 'bg-[#5e1224] text-[#c5a059]'
                                : 'hover:bg-[#5e1224]/10 hover:text-[#5e1224]'
                            }`}
                          >
                            <span className="whitespace-nowrap">
                              {pub.label}
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  )}
                </li>
              )
            }

            return (
              <li key={route.path}>
                <a
                  href={route.path}
                  onClick={(e) => onNavigate(e, route.path)}
                  className={`transition-colors pb-1 whitespace-nowrap ${
                    isActiveRoute
                      ? 'text-[#5e1224] border-b-2 border-[#c5a059]'
                      : navIsWhite
                      ? 'hover:text-[#5e1224]'
                      : 'hover:text-white'
                  }`}
                >
                  {route.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
