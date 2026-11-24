export const NAV_ROUTES = [
  { path: '/tramites', label: 'Trámites' },
  { path: '/historia', label: 'Historia' },
  { path: '/publicaciones', label: 'Publicaciones' },
  { path: '/servicios', label: 'Servicios' },
  { path: '/galeria', label: 'Galería' },
  { path: '/festividades', label: 'Festividades' },
  { path: '/grupos-parroquiales', label: 'Comunidad' },
]

export const TRAMITES_SUBROUTES = [
  { id: 'bautismo', path: '/tramites/bautismo', label: 'Sacramento de Bautismo' },
  { id: 'matrimonio', path: '/tramites/matrimonio', label: 'Sacramento de Matrimonio' },
]

export const HISTORIA_SUBROUTES = [
  { id: 'creacion', path: '/historia/creacion', label: 'Creación e Historia' },
  { id: 'arquitectura', path: '/historia/arquitectura', label: 'Arquitectura y Arte' },
  { id: 'parrocos', path: '/historia/parrocos', label: 'Párrocos Históricos' },
]

export const PUBLICACIONES_SUBROUTES = [
  { id: 'eventos', path: '/publicaciones/eventos', label: 'Eventos' },
  { id: 'audiovisuales', path: '/publicaciones/audiovisuales', label: 'Audiovisuales' },
]

export function normalizePath(p) {
  if (!p || p === '/') return '/'
  const lower = p.replace(/\/+$/, '').toLowerCase()

  if (lower === '/tramites' || lower === '/tramites/bautismo') {
    return '/tramites/bautismo'
  }
  if (lower === '/tramites/matrimonio') {
    return '/tramites/matrimonio'
  }

  if (lower === '/historia' || lower === '/historia/creacion') {
    return '/historia/creacion'
  }
  if (lower === '/historia/arquitectura') {
    return '/historia/arquitectura'
  }
  if (lower === '/historia/parrocos') {
    return '/historia/parrocos'
  }

  if (lower === '/publicaciones' || lower === '/publicaciones/eventos') {
    return '/publicaciones/eventos'
  }
  if (lower === '/publicaciones/audiovisuales' || lower === '/publicaciones/documentales') {
    return '/publicaciones/audiovisuales'
  }

  return lower
}

export function resolveRouteInfo(path) {
  const lower = normalizePath(path)

  if (lower.startsWith('/tramites')) {
    const sub = lower.split('/')[2] || 'bautismo'
    const activeTab = sub === 'matrimonio' ? 'matrimonio' : 'bautismo'
    return { baseRoute: '/tramites', activeTab }
  }

  if (lower.startsWith('/historia')) {
    const sub = lower.split('/')[2] || 'creacion'
    const activeChapter =
      sub === 'arquitectura'
        ? 'arquitectura'
        : sub === 'parrocos'
        ? 'parrocos'
        : 'creacion'
    return { baseRoute: '/historia', activeChapter }
  }

  if (lower.startsWith('/publicaciones')) {
    const sub = lower.split('/')[2] || 'eventos'
    const activePublicacion = sub === 'audiovisuales' ? 'audiovisuales' : 'eventos'
    return { baseRoute: '/publicaciones', activePublicacion }
  }

  return { baseRoute: lower }
}
