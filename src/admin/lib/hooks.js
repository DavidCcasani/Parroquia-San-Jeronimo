import { useEffect, useRef, useState } from 'react'

// Mantiene montado un elemento durante su animación de salida.
// state: 'closed' (antes de entrar / saliendo) | 'open'
export function usePresence(open, exitMs = 200) {
  const [mounted, setMounted] = useState(open)
  const [state, setState] = useState('closed')

  useEffect(() => {
    let raf1
    let raf2
    let timer
    if (open) {
      setMounted(true)
      // Dos frames: el navegador pinta el estado inicial antes de transicionar.
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setState('open'))
      })
    } else {
      setState('closed')
      timer = setTimeout(() => setMounted(false), exitMs)
    }
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(timer)
    }
  }, [open, exitMs])

  return { mounted, state }
}

// URL temporal para mostrar un Blob; se libera al cambiar o desmontar.
export function useObjectUrl(blob) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])
  return url
}

// Atrapa el foco dentro de un diálogo, cierra con Escape y devuelve el foco al salir.
export function useDialogFocus(open, onClose) {
  const ref = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const node = ref.current
    const focusables = () =>
      node
        ? Array.from(
            node.querySelectorAll(
              'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          )
        : []
    const first = node?.querySelector('[data-autofocus]') || focusables()[0]
    first?.focus({ preventScroll: true })

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current?.()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [open])

  return ref
}
