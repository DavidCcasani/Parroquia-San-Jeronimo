import { useMemo, useState } from 'react'
import Segmented from './components/Segmented'
import { IconEdit, IconImage, IconPlus, IconSearch, IconTrash } from './components/Icons'
import { useObjectUrl } from './lib/hooks'

const fmt = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

function normalize(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

function PostCard({ post, index, onEdit, onDelete }) {
  const url = useObjectUrl(post.imagenBlob)
  const publicado = post.estado === 'publicado'
  return (
    <article className="adm-post" style={{ '--i': Math.min(index, 8) }}>
      <div className="adm-post__media">
        {url ? (
          <img src={url} alt="" loading="lazy" />
        ) : (
          <div className="adm-post__noimg">
            <IconImage width={22} height={22} />
          </div>
        )}
        <span className={`adm-badge adm-badge--${publicado ? 'publicado' : 'borrador'}`}>
          {publicado ? 'Publicada' : 'Borrador'}
        </span>
      </div>
      <div className="adm-post__body">
        <div className="adm-post__meta">
          {[post.categoria, post.fecha].filter(Boolean).join(', ') || 'Sin categoría ni fecha'}
        </div>
        <h3 className="adm-post__title">{post.titulo}</h3>
      </div>
      <div className="adm-post__foot">
        <span>Editada el {fmt.format(post.updatedAt)}</span>
        <div>
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm adm-btn--icon"
            onClick={() => onEdit(post)}
            aria-label={`Editar «${post.titulo}»`}
          >
            <IconEdit />
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm adm-btn--icon"
            onClick={() => onDelete(post)}
            aria-label={`Eliminar «${post.titulo}»`}
            style={{ color: 'var(--error)' }}
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </article>
  )
}

function PostList({ posts, loading, onCreate, onEdit, onDelete }) {
  const [filter, setFilter] = useState('todas')
  const [query, setQuery] = useState('')

  const counts = useMemo(
    () => ({
      todas: posts.length,
      publicado: posts.filter((p) => p.estado === 'publicado').length,
      borrador: posts.filter((p) => p.estado !== 'publicado').length,
    }),
    [posts]
  )

  const visible = useMemo(() => {
    const q = normalize(query.trim())
    return posts.filter((p) => {
      if (filter === 'publicado' && p.estado !== 'publicado') return false
      if (filter === 'borrador' && p.estado === 'publicado') return false
      if (!q) return true
      return normalize(`${p.titulo} ${p.categoria} ${p.lugar}`).includes(q)
    })
  }, [posts, filter, query])

  return (
    <>
      <div className="adm-pagehead">
        <div>
          <h1>Publicaciones</h1>
          <p>Crea y edita las tarjetas de eventos que se muestran en el sitio de la parroquia.</p>
        </div>
        <button type="button" className="adm-btn adm-btn--primary" onClick={onCreate}>
          <IconPlus /> Nueva publicación
        </button>
      </div>

      {posts.length > 0 && (
        <div className="adm-toolbar">
          <Segmented
            label="Filtrar por estado"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'todas', label: 'Todas', count: counts.todas },
              { value: 'publicado', label: 'Publicadas', count: counts.publicado },
              { value: 'borrador', label: 'Borradores', count: counts.borrador },
            ]}
          />
          <div className="adm-search">
            <IconSearch />
            <input
              className="adm-input"
              type="search"
              placeholder="Buscar por título, categoría o lugar"
              aria-label="Buscar publicaciones"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {loading ? null : posts.length === 0 ? (
        <div className="adm-empty">
          <span className="adm-empty__icon">
            <IconImage />
          </span>
          <h2>Aún no hay publicaciones</h2>
          <p>Crea la primera: sube una imagen, ajusta el encuadre y completa los datos del evento.</p>
          <button type="button" className="adm-btn adm-btn--primary" onClick={onCreate}>
            <IconPlus /> Nueva publicación
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="adm-empty">
          <h2>Sin resultados</h2>
          <p>Ninguna publicación coincide con la búsqueda o el filtro elegido.</p>
          <button
            type="button"
            className="adm-btn"
            onClick={() => {
              setQuery('')
              setFilter('todas')
            }}
          >
            Ver todas
          </button>
        </div>
      ) : (
        <div className="adm-grid">
          {visible.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </>
  )
}

export default PostList
