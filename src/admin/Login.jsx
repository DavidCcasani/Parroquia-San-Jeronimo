import { useEffect, useRef, useState } from 'react'
import { isAuthConfigured, login } from './lib/auth'
import { IconAlert, IconEye, IconEyeOff, IconLock } from './components/Icons'

const MAX_ATTEMPTS = 5
const LOCK_MS = 30_000

function Login({ onSuccess }) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(Date.now())
  const attempts = useRef(0)
  const userRef = useRef(null)
  const passRef = useRef(null)

  const locked = lockedUntil > now
  const secondsLeft = Math.ceil((lockedUntil - now) / 1000)

  useEffect(() => {
    if (!locked) return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [locked])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (busy || locked) return
    if (!user.trim() || !password) {
      setError('Escribe tu usuario y tu contraseña.')
      setShakeKey((k) => k + 1)
      ;(!user.trim() ? userRef : passRef).current?.focus()
      return
    }
    setBusy(true)
    setError('')
    const ok = await login(user, password)
    if (ok) {
      onSuccess()
      return
    }
    attempts.current += 1
    setBusy(false)
    setShakeKey((k) => k + 1)
    if (attempts.current >= MAX_ATTEMPTS) {
      attempts.current = 0
      const until = Date.now() + LOCK_MS
      setNow(Date.now())
      setLockedUntil(until)
      setError('Demasiados intentos. Espera unos segundos antes de volver a intentarlo.')
    } else {
      setError('El usuario o la contraseña no son correctos.')
    }
    setPassword('')
    passRef.current?.focus()
  }

  return (
    <div className="adm-login">
      <div className="adm-login__photo" aria-hidden="true">
        <img src="/imagenes/retablo_mayor.jpg" alt="" />
        <div className="adm-login__caption">
          <p>Lo que se publica aquí lo lee toda la comunidad del valle.</p>
          <span>Templo Matriz de San Jerónimo, Andahuaylas</span>
        </div>
      </div>

      <main className="adm-login__panel">
        <form className="adm-login__form" onSubmit={handleSubmit} noValidate>
          <div className="adm-login__brand">
            <img src="/imagenes/logo principal dorado.png" alt="" />
            <div>
              <strong>Parroquia San Jerónimo</strong>
              <span>Panel de publicaciones</span>
            </div>
          </div>

          <h1>Inicia sesión</h1>
          <p className="adm-login__lead">Accede para crear y editar las publicaciones del sitio.</p>

          {!isAuthConfigured && (
            <div className="adm-alert adm-alert--info" role="status">
              <IconLock />
              <span>
                Falta configurar el acceso. Define <code>VITE_ADMIN_USER</code> y{' '}
                <code>VITE_ADMIN_PASS_SHA256</code> en <code>.env.local</code> y reinicia el servidor.
              </span>
            </div>
          )}

          <div className="adm-field">
            <label className="adm-label" htmlFor="adm-user">
              Usuario
            </label>
            <input
              ref={userRef}
              id="adm-user"
              className="adm-input"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={locked}
              autoFocus
            />
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="adm-pass">
              Contraseña
            </label>
            <div className="adm-password">
              <input
                ref={passRef}
                id="adm-pass"
                className="adm-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={locked}
                aria-describedby={error ? 'adm-login-error' : undefined}
              />
              <button
                type="button"
                className="adm-btn adm-btn--ghost adm-btn--icon"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <div aria-live="assertive">
            {error && (
              <div key={shakeKey} id="adm-login-error" className="adm-alert adm-shake" role="alert">
                <IconAlert />
                <span>
                  {error}
                  {locked && ` (${secondsLeft} s)`}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn--primary"
            disabled={locked || !isAuthConfigured}
            data-busy={busy}
            style={{ minHeight: 48 }}
          >
            <span className="adm-btn__label">
              {busy && <span className="adm-spinner" aria-hidden="true" />}
              {busy ? 'Entrando…' : 'Entrar al panel'}
            </span>
          </button>
        </form>
      </main>
    </div>
  )
}

export default Login
