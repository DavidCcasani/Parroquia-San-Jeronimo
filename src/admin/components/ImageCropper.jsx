import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  CROP_ASPECT,
  DEFAULT_CROP,
  MAX_ZOOM,
  MIN_ZOOM,
  SAFE_BAND_RATIO,
  clamp,
  clampCrop,
  coverScale,
  maxOffset,
} from '../lib/crop'
import { IconReset, IconRotate, IconZoomIn, IconZoomOut } from './Icons'

// Resistencia al arrastrar fuera del límite (fricción en lugar de un tope seco).
const RUBBER = 0.35
const rubber = (value, limit) => {
  if (value > limit) return limit + (value - limit) * RUBBER
  if (value < -limit) return -limit + (value + limit) * RUBBER
  return value
}

/**
 * Recortador: arrastra para mover, rueda o pellizco para acercar,
 * flechas y +/- desde el teclado. El encuadre se expresa normalizado
 * (x, y en fracción del marco) para exportarlo idéntico.
 */
function ImageCropper({ src, natural, value, onChange }) {
  const stageRef = useRef(null)
  const imgRef = useRef(null)
  const [frame, setFrame] = useState({ w: 0, h: 0 })
  const [dragging, setDragging] = useState(false)
  const [settling, setSettling] = useState(false)
  const [showSafe, setShowSafe] = useState(true)
  const crop = value || DEFAULT_CROP
  const cropRef = useRef(crop)
  cropRef.current = crop

  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const liveRef = useRef(null) // posición con fricción mientras se arrastra
  const settleTimer = useRef(0)

  // Medir el marco (cambia con el tamaño de la ventana)
  useLayoutEffect(() => {
    const node = stageRef.current
    if (!node) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setFrame({ w: width, h: height })
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  // Escribir el transform directamente: el arrastre sigue al dedo 1:1 sin re-render.
  const paint = useCallback(
    (c) => {
      const img = imgRef.current
      if (!img || !frame.w || !natural) return
      const s = coverScale(natural.w, natural.h, frame.w, frame.h, c.rotation) * c.zoom
      img.style.transform = `translate(-50%, -50%) translate(${c.x * frame.w}px, ${c.y * frame.h}px) rotate(${c.rotation}deg) scale(${s})`
    },
    [frame.w, frame.h, natural]
  )

  useLayoutEffect(() => {
    if (!dragging) paint(crop)
  }, [crop, paint, dragging])

  const commit = useCallback(
    (next, { settle = false } = {}) => {
      const clamped = clampCrop(next, natural.w, natural.h)
      if (settle) {
        setSettling(true)
        window.clearTimeout(settleTimer.current)
        settleTimer.current = window.setTimeout(() => setSettling(false), 380)
      }
      onChange(clamped)
    },
    [natural, onChange]
  )

  // Acercar manteniendo fijo el punto bajo el cursor
  const zoomAround = useCallback(
    (base, nextZoom, px = 0, py = 0) => {
      const z = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM)
      const ratio = z / base.zoom
      return { ...base, zoom: z, x: px - (px - base.x) * ratio, y: py - (py - base.y) * ratio }
    },
    []
  )

  const relPoint = (clientX, clientY) => {
    const rect = stageRef.current.getBoundingClientRect()
    return {
      x: (clientX - rect.left - rect.width / 2) / rect.width,
      y: (clientY - rect.top - rect.height / 2) / rect.height,
    }
  }

  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    stageRef.current.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    setSettling(false)

    const pts = [...pointers.current.values()]
    if (pts.length === 1) {
      gesture.current = { type: 'pan', startX: e.clientX, startY: e.clientY, base: { ...cropRef.current } }
    } else if (pts.length === 2) {
      // Segundo dedo: cambiar a pellizco desde la posición actual
      const base = liveRef.current || cropRef.current
      const [a, b] = pts
      gesture.current = {
        type: 'pinch',
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        mid: relPoint((a.x + b.x) / 2, (a.y + b.y) / 2),
        base: clampCrop(base, natural.w, natural.h),
      }
    }
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    let next

    if (g.type === 'pan') {
      const dx = (e.clientX - g.startX) / frame.w
      const dy = (e.clientY - g.startY) / frame.h
      const m = maxOffset(natural.w, natural.h, frame.w, frame.h, g.base.zoom, g.base.rotation)
      next = { ...g.base, x: rubber(g.base.x + dx, m.x), y: rubber(g.base.y + dy, m.y) }
    } else {
      const [a, b] = [...pointers.current.values()]
      if (!b) return
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const mid = relPoint((a.x + b.x) / 2, (a.y + b.y) / 2)
      const zoomed = zoomAround(g.base, g.base.zoom * (dist / g.dist), g.mid.x, g.mid.y)
      next = { ...zoomed, x: zoomed.x + (mid.x - g.mid.x), y: zoomed.y + (mid.y - g.mid.y) }
    }
    liveRef.current = next
    paint(next)
  }

  const endPointer = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.delete(e.pointerId)
    const remaining = [...pointers.current.entries()]
    const live = liveRef.current

    if (remaining.length === 1 && live) {
      // Se levantó un dedo del pellizco: seguir moviendo con el otro sin saltos
      const [, p] = remaining[0]
      gesture.current = { type: 'pan', startX: p.x, startY: p.y, base: clampCrop(live, natural.w, natural.h) }
      liveRef.current = gesture.current.base
      paint(gesture.current.base)
      return
    }
    if (remaining.length === 0) {
      gesture.current = null
      setDragging(false)
      if (live) {
        liveRef.current = null
        // Mismo render que dragging=false: la imagen vuelve al límite con transición
        // desde donde quedó el dedo, sin saltar a la posición anterior.
        commit(live, { settle: true })
      }
    }
  }

  // Rueda del mouse / trackpad: acercar hacia el cursor
  useEffect(() => () => window.clearTimeout(settleTimer.current), [])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const onWheel = (e) => {
      e.preventDefault()
      const p = relPoint(e.clientX, e.clientY)
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018))
      const base = cropRef.current
      commit(zoomAround(base, base.zoom * factor, p.x, p.y))
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [commit, zoomAround])

  // Alternativa de teclado al arrastre
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 0.08 : 0.02
    const c = cropRef.current
    let next = null
    if (e.key === 'ArrowLeft') next = { ...c, x: c.x - step }
    if (e.key === 'ArrowRight') next = { ...c, x: c.x + step }
    if (e.key === 'ArrowUp') next = { ...c, y: c.y - step }
    if (e.key === 'ArrowDown') next = { ...c, y: c.y + step }
    if (e.key === '+' || e.key === '=') next = zoomAround(c, c.zoom * 1.1)
    if (e.key === '-' || e.key === '_') next = zoomAround(c, c.zoom / 1.1)
    if (next) {
      e.preventDefault()
      commit(next)
    }
  }

  const setZoom = (z) => commit(zoomAround(crop, z))
  // De 270° a 0° no se anima: la transición giraría tres cuartos hacia atrás.
  const rotate = () =>
    commit({ ...crop, rotation: (crop.rotation + 90) % 360, x: 0, y: 0 }, { settle: crop.rotation !== 270 })
  const reset = () => commit({ ...DEFAULT_CROP }, { settle: true })

  const zoomFill = ((crop.zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100

  return (
    <div className="adm-crop">
      <div>
        <div
          ref={stageRef}
          className="adm-crop__stage"
          data-dragging={dragging}
          data-settling={settling}
          tabIndex={0}
          role="group"
          aria-roledescription="Área de encuadre"
          aria-label="Encuadre de la imagen. Usa las flechas para mover y las teclas más y menos para acercar."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onKeyDown={onKeyDown}
          style={{ aspectRatio: CROP_ASPECT }}
        >
          {natural && (
            <img
              ref={imgRef}
              className="adm-crop__img"
              src={src}
              alt=""
              draggable={false}
              style={{ width: natural.w, height: natural.h }}
            />
          )}
          <div className="adm-crop__grid" />
          <div
            className="adm-crop__safe"
            data-hidden={!showSafe || dragging}
            style={{ height: `${SAFE_BAND_RATIO * 100}%` }}
          >
            <span>Se ve en todas las secciones</span>
          </div>
        </div>
      </div>

      <div className="adm-crop__controls">
        <div className="adm-crop__group">
          <span id="adm-zoom-label">Acercar</span>
          <div className="adm-crop__row">
            <button
              type="button"
              className="adm-btn adm-btn--ghost adm-btn--sm adm-btn--icon"
              onClick={() => setZoom(crop.zoom / 1.2)}
              disabled={crop.zoom <= MIN_ZOOM}
              aria-label="Alejar"
            >
              <IconZoomOut />
            </button>
            <input
              type="range"
              className="adm-range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={crop.zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-labelledby="adm-zoom-label"
              aria-valuetext={`${Math.round(crop.zoom * 100)} por ciento`}
              style={{ '--fill': `${zoomFill}%` }}
            />
            <button
              type="button"
              className="adm-btn adm-btn--ghost adm-btn--sm adm-btn--icon"
              onClick={() => setZoom(crop.zoom * 1.2)}
              disabled={crop.zoom >= MAX_ZOOM}
              aria-label="Acercar"
            >
              <IconZoomIn />
            </button>
          </div>
          <span className="adm-crop__value" style={{ textAlign: 'left' }}>
            {Math.round(crop.zoom * 100)} %
          </span>
        </div>

        <div className="adm-crop__group">
          <span>Ajustes</span>
          <div className="adm-crop__row" style={{ flexWrap: 'wrap' }}>
            <button type="button" className="adm-btn adm-btn--sm" onClick={rotate}>
              <IconRotate /> Girar 90°
            </button>
            <button type="button" className="adm-btn adm-btn--sm" onClick={reset}>
              <IconReset /> Restablecer
            </button>
          </div>
        </div>

        <label className="adm-switch">
          <input type="checkbox" checked={showSafe} onChange={(e) => setShowSafe(e.target.checked)} />
          <span className="adm-switch__track">
            <span className="adm-switch__thumb" />
          </span>
          <span className="adm-switch__text">
            <strong>Mostrar franja segura</strong>
            <span>Lo que quede fuera puede recortarse en la vista de detalle.</span>
          </span>
        </label>

        <p className="adm-crop__help">
          Arrastra la imagen para moverla. Usa la rueda o pellizca para acercar. Con el teclado:{' '}
          <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> y <kbd>+</kbd> <kbd>−</kbd>.
        </p>
      </div>
    </div>
  )
}

export default ImageCropper
