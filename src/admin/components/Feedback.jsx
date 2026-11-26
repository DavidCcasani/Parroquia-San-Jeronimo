import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDialogFocus, usePresence } from '../lib/hooks'
import { IconAlert, IconCheck, IconClose } from './Icons'

/* ----------------------------------------------------------------------------
   Avisos breves. Entran y salen por abajo; se usan transiciones (no keyframes)
   para que varios avisos seguidos se reacomoden sin saltos.
---------------------------------------------------------------------------- */

const ToastContext = createContext(() => {})

export const useToast = () => useContext(ToastContext)

function ToastItem({ toast, onDone }) {
  const [open, setOpen] = useState(true)
  const { mounted, state } = usePresence(open, 400)
  const timer = useRef(null)
  const remaining = useRef(4000)
  const startedAt = useRef(0)

  const start = useCallback(() => {
    startedAt.current = Date.now()
    timer.current = setTimeout(() => setOpen(false), remaining.current)
  }, [])

  const pause = () => {
    clearTimeout(timer.current)
    remaining.current -= Date.now() - startedAt.current
  }

  useEffect(() => {
    start()
    // Pausar cuando la pestaña no está visible para que el aviso no se pierda.
    const onVis = () => (document.hidden ? pause() : start())
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [start])

  useEffect(() => {
    if (!mounted) onDone(toast.id)
  }, [mounted, onDone, toast.id])

  if (!mounted) return null
  return (
    <div
      className={`adm-toast ${toast.type === 'error' ? 'adm-toast--error' : ''}`}
      data-state={state}
      role={toast.type === 'error' ? 'alert' : 'status'}
      onMouseEnter={pause}
      onMouseLeave={start}
    >
      {toast.type === 'error' ? <IconAlert /> : <IconCheck />}
      <span>{toast.message}</span>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((message, type = 'success') => {
    setToasts((list) => [...list.slice(-2), { id: crypto.randomUUID?.() || String(Math.random()), message, type }])
  }, [])
  const remove = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      {createPortal(
        <div className="adm adm-toasts" style={{ minHeight: 0, background: 'none' }} aria-live="polite">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDone={remove} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/* ----------------------------------------------------------------------------
   Diálogo modal. En escritorio aparece centrado; en móvil sube como hoja.
---------------------------------------------------------------------------- */

export function Dialog({ open, onClose, title, description, wide = false, children, footer, labelledBy }) {
  const { mounted, state } = usePresence(open, 240)
  const ref = useDialogFocus(open, onClose)
  const titleId = labelledBy || 'adm-dialog-title'

  if (!mounted) return null
  return createPortal(
    <div
      className="adm adm-overlay"
      data-state={state}
      style={{ minHeight: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        className={`adm-dialog ${wide ? 'adm-dialog--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="adm-dialog__head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--icon" onClick={onClose} aria-label="Cerrar">
            <IconClose />
          </button>
        </div>
        <div className="adm-dialog__body">{children}</div>
        {footer && <div className="adm-dialog__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export function ConfirmDialog({ open, title, description, confirmLabel, tone = 'danger', onConfirm, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      labelledBy="adm-confirm-title"
      footer={
        <>
          <button type="button" className="adm-btn" onClick={onClose} data-autofocus>
            Cancelar
          </button>
          <button
            type="button"
            className={`adm-btn ${tone === 'danger' ? 'adm-btn--danger' : 'adm-btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--humo)' }}>{description}</p>
    </Dialog>
  )
}
