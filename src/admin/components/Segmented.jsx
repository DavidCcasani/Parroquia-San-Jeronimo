import { useLayoutEffect, useRef, useState } from 'react'

// Control segmentado. El indicador se desliza hacia la opción elegida para
// mostrar qué cambió; el texto cambia de color al instante.
function Segmented({ options, value, onChange, label, role = 'toolbar' }) {
  const wrapRef = useRef(null)
  const [indicator, setIndicator] = useState(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => {
      const active = wrap.querySelector('[data-active="true"]')
      if (!active) return
      setIndicator({ x: active.offsetLeft, w: active.offsetWidth })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [value, options])

  const isTabs = role === 'tablist'

  return (
    <div ref={wrapRef} className="adm-segmented" role={role} aria-label={label}>
      {indicator && (
        <span
          className="adm-segmented__indicator"
          style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
          aria-hidden="true"
        />
      )}
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            data-active={active}
            role={isTabs ? 'tab' : undefined}
            aria-selected={isTabs ? active : undefined}
            aria-pressed={isTabs ? undefined : active}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
            {typeof opt.count === 'number' && <span>{opt.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export default Segmented
