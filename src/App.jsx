import { useEffect, useRef, useState } from 'react'
import initialImages from 'virtual:imagenes'
import { normalizePath, resolveRouteInfo } from './constants/routes'
import IntroCurtain from './components/IntroCurtain'
import HeroCarousel from './components/HeroCarousel'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingBubbles from './components/FloatingBubbles'
import HomePage from './pages/HomePage'
import TramitesPage from './pages/TramitesPage'
import HistoriaPage from './pages/HistoriaPage'
import PublicacionesPage from './pages/PublicacionesPage'
import ServiciosPage from './pages/ServiciosPage'
import GaleriaPage from './pages/GaleriaPage'
import FestividadesPage from './pages/FestividadesPage'
import GruposParroquialesPage from './pages/GruposParroquialesPage'

const DEFAULT_IMAGES = [
  '/imagenes/DSC_0640.jpg',
  '/imagenes/DSC_0646.jpg',
  '/imagenes/DSC_0661.jpg',
]

const filterCarouselImages = (list) =>
  Array.isArray(list)
    ? list.filter((src) => !src.toLowerCase().includes('logo'))
    : []

const PAGE_COMPONENTS = {
  '/tramites': TramitesPage,
  '/historia': HistoriaPage,
  '/publicaciones': PublicacionesPage,
  '/servicios': ServiciosPage,
  '/galeria': GaleriaPage,
  '/festividades': FestividadesPage,
  '/grupos-parroquiales': GruposParroquialesPage,
}

function App() {
  const filteredInitial = filterCarouselImages(initialImages)
  const [images, setImages] = useState(
    filteredInitial.length > 0 ? filteredInitial : DEFAULT_IMAGES
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isNavAtTop, setIsNavAtTop] = useState(false)
  const [isCurtainUp, setIsCurtainUp] = useState(false)
  const [curtainDuration, setCurtainDuration] = useState(1000)
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname)
  )
  const navRef = useRef(null)
  const routeSwapTimeoutRef = useRef(null)
  const curtainUpTimeoutRef = useRef(null)

  const isHome = currentPath === '/'
  const routeInfo = resolveRouteInfo(currentPath)

  // Sincronizar la barra de direcciones si el usuario entró a /tramites o /historia sin sub-ruta
  useEffect(() => {
    if (window.location.pathname !== currentPath) {
      window.history.replaceState({}, '', currentPath)
    }
  }, [currentPath])

  const clearCurtainTimers = () => {
    if (routeSwapTimeoutRef.current) clearTimeout(routeSwapTimeoutRef.current)
    if (curtainUpTimeoutRef.current) clearTimeout(curtainUpTimeoutRef.current)
  }

  const navigate = (e, to) => {
    if (e && e.preventDefault) e.preventDefault()
    const target = normalizePath(to)
    if (target === currentPath) return

    clearCurtainTimers()
    // 1. Baja el telón rápido sobre la vista actual
    const dropMs = 500
    const holdMs = 150
    const liftMs = 800

    setCurtainDuration(dropMs)
    setIsCurtainUp(false)

    // 2. Cuando el telón ya cubrió toda la pantalla, cambia la ruta por detrás
    routeSwapTimeoutRef.current = setTimeout(() => {
      window.history.pushState({}, '', target)
      setCurrentPath(target)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, dropMs)

    // 3. Sube el telón revelando la nueva ruta
    curtainUpTimeoutRef.current = setTimeout(() => {
      setCurtainDuration(liftMs)
      setIsCurtainUp(true)
    }, dropMs + holdMs)
  }

  useEffect(() => {
    const onPopState = () => {
      const target = normalizePath(window.location.pathname)
      clearCurtainTimers()
      const dropMs = 450
      const holdMs = 150
      const liftMs = 750

      setCurtainDuration(dropMs)
      setIsCurtainUp(false)

      routeSwapTimeoutRef.current = setTimeout(() => {
        setCurrentPath(target)
        window.scrollTo({ top: 0, behavior: 'instant' })
      }, dropMs)

      curtainUpTimeoutRef.current = setTimeout(() => {
        setCurtainDuration(liftMs)
        setIsCurtainUp(true)
      }, dropMs + holdMs)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    curtainUpTimeoutRef.current = setTimeout(() => {
      setCurtainDuration(1000)
      setIsCurtainUp(true)
    }, 1100)
    return () => clearCurtainTimers()
  }, [])

  useEffect(() => {
    fetch('/api/imagenes')
      .then((r) => (r.ok ? r.json() : null))
      .then((list) => {
        const filtered = filterCarouselImages(list)
        if (filtered.length > 0) {
          setImages(filtered)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isHome || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isHome, images.length])

  useEffect(() => {
    if (!isHome) {
      setIsNavAtTop(true)
      return
    }

    const handleScroll = () => {
      if (!navRef.current) return
      const rect = navRef.current.getBoundingClientRect()
      setIsNavAtTop(rect.top <= 4)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const navIsWhite = !isHome || isNavAtTop
  const ActivePage = PAGE_COMPONENTS[routeInfo.baseRoute]

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <IntroCurtain isCurtainUp={isCurtainUp} durationMs={curtainDuration} />

      {isHome && <HeroCarousel images={images} currentIndex={currentIndex} />}

      <Navbar
        navRef={navRef}
        isHome={isHome}
        navIsWhite={navIsWhite}
        currentPath={currentPath}
        onNavigate={navigate}
      />

      {isHome ? (
        <HomePage onNavigate={navigate} />
      ) : ActivePage ? (
        <ActivePage
          onNavigate={navigate}
          activeChapter={routeInfo.activeChapter}
          activeTab={routeInfo.activeTab}
          activePublicacion={routeInfo.activePublicacion}
        />
      ) : (
        <HomePage onNavigate={navigate} />
      )}

      <Footer onNavigate={navigate} />
      <FloatingBubbles />
    </div>
  )
}

export default App
