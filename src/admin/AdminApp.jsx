import { useCallback, useEffect, useRef, useState } from 'react'
import './admin.css'
import Login from './Login'
import PostList from './PostList'
import PostEditor from './PostEditor'
import { ConfirmDialog, ToastProvider, useToast } from './components/Feedback'
import { IconExternal, IconLogout } from './components/Icons'
import { getSession, logout } from './lib/auth'
import { deletePost, listPosts } from './lib/store'

// El panel no debe aparecer en buscadores.
function useAdminHead() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Panel de publicaciones — Parroquia San Jerónimo'
    let robots = document.querySelector('meta[name="robots"]')
    const prevRobots = robots?.getAttribute('content')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex, nofollow')
    return () => {
      document.title = prevTitle
      if (prevRobots) robots.setAttribute('content', prevRobots)
    }
  }, [])
}

function Dashboard({ onLogout }) {
  const toast = useToast()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState({ name: 'list', post: null })
  const [phase, setPhase] = useState('closed')
  const [toDelete, setToDelete] = useState(null)
  const swapTimer = useRef(0)
  const lastDelete = useRef(null)
  if (toDelete) lastDelete.current = toDelete

  const refresh = useCallback(async () => {
    try {
      setPosts(await listPosts())
    } catch {
      toast('No se pudieron cargar las publicaciones guardadas en este navegador.', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    refresh()
    const raf = requestAnimationFrame(() => setPhase('open'))
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(swapTimer.current)
    }
  }, [refresh])

  // Salida rápida (140 ms) y entrada algo más lenta (220 ms en CSS).
  const go = (next) => {
    clearTimeout(swapTimer.current)
    setPhase('closed')
    swapTimer.current = setTimeout(() => {
      setView(next)
      window.scrollTo({ top: 0, behavior: 'instant' })
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('open')))
    }, 140)
  }

  const confirmDelete = async () => {
    const post = toDelete
    setToDelete(null)
    if (!post) return
    try {
      await deletePost(post.id)
      setPosts((list) => list.filter((p) => p.id !== post.id))
      toast('Publicación eliminada.')
    } catch {
      toast('No se pudo eliminar la publicación.', 'error')
    }
  }

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar__brand">
          <img src="/imagenes/logo principal dorado.png" alt="" />
          <strong>San Jerónimo</strong>
          <span>Panel de publicaciones</span>
        </div>
        <nav className="adm-topbar__actions" aria-label="Cuenta">
          <a className="adm-btn adm-btn--ghost adm-btn--sm" href="/" target="_blank" rel="noreferrer">
            <IconExternal /> <span>Ver sitio</span>
          </a>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onLogout}>
            <IconLogout /> <span>Cerrar sesión</span>
          </button>
        </nav>
      </header>

      <main className="adm-main">
        <div className="adm-view" data-state={phase}>
          {view.name === 'list' ? (
            <PostList
              posts={posts}
              loading={loading}
              onCreate={() => go({ name: 'editor', post: null })}
              onEdit={(post) => go({ name: 'editor', post })}
              onDelete={setToDelete}
            />
          ) : (
            <PostEditor
              key={view.post?.id || 'nueva'}
              post={view.post}
              onBack={() => go({ name: 'list', post: null })}
              onSaved={async () => {
                await refresh()
                go({ name: 'list', post: null })
              }}
            />
          )}
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="¿Eliminar esta publicación?"
        description={lastDelete.current ? `«${lastDelete.current.titulo}» se eliminará de forma permanente. Esta acción no se puede deshacer.` : ''}
        confirmLabel="Eliminar"
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function AdminApp() {
  useAdminHead()
  const [session, setSession] = useState(() => getSession())

  // Mantener la URL en /admin (sin subrutas)
  useEffect(() => {
    if (window.location.pathname !== '/admin') window.history.replaceState({}, '', '/admin')
  }, [])

  return (
    <div className="adm">
      <ToastProvider>
        {session ? (
          <Dashboard
            onLogout={() => {
              logout()
              setSession(null)
            }}
          />
        ) : (
          <Login onSuccess={() => setSession(getSession())} />
        )}
      </ToastProvider>
    </div>
  )
}

export default AdminApp
