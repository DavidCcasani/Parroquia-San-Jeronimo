import { useEffect, useMemo, useRef, useState } from 'react'
import { EVENTOS_CATEGORIAS } from '../data/eventosData'
import ImageCropper from './components/ImageCropper'
import { ConfirmDialog, Dialog, useToast } from './components/Feedback'
import { DetalleCardPreview, EventoCardPreview, PortadaCardPreview } from './components/PostPreview'
import Segmented from './components/Segmented'
import { IconAlert, IconArrowLeft, IconCalendar, IconCrop, IconImage, IconTrash, IconUpload } from './components/Icons'
import { DEFAULT_CROP, loadImage, renderCrop } from './lib/crop'
import { useObjectUrl } from './lib/hooks'
import { newId, savePost } from './lib/store'

const CATEGORIAS = EVENTOS_CATEGORIAS.filter((c) => c !== 'Todos')
const MAX_FILE_MB = 15
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const LIMITS = { titulo: 90, resumen: 200, etiqueta: 30 }

const EMPTY = {
  titulo: '',
  categoria: '',
  fecha: '',
  hora: '',
  lugar: '',
  resumen: '',
  descripcion: '',
  organizador: '',
  etiqueta: '',
  destacado: false,
}

const FIELD_NAMES = {
  titulo: 'Título',
  categoria: 'Categoría',
  fecha: 'Fecha',
  hora: 'Horario',
  lugar: 'Lugar',
  resumen: 'Resumen',
  imagen: 'Imagen',
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatFecha(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return ''
  return `${d} de ${MESES[m - 1]}`
}

function validate(form, hasImage, mode) {
  const errors = {}
  if (!form.titulo.trim()) errors.titulo = 'Escribe un título.'
  else if (form.titulo.length > LIMITS.titulo) errors.titulo = `Usa como máximo ${LIMITS.titulo} caracteres.`
  if (form.resumen.length > LIMITS.resumen) errors.resumen = `Usa como máximo ${LIMITS.resumen} caracteres.`
  if (form.etiqueta.length > LIMITS.etiqueta) errors.etiqueta = `Usa como máximo ${LIMITS.etiqueta} caracteres.`
  if (mode === 'publicado') {
    if (!form.categoria) errors.categoria = 'Elige una categoría.'
    if (!form.fecha.trim()) errors.fecha = 'Indica la fecha o el periodo.'
    if (!form.hora.trim()) errors.hora = 'Indica el horario.'
    if (!form.lugar.trim()) errors.lugar = 'Indica dónde será.'
    if (!form.resumen.trim()) errors.resumen = 'Escribe un resumen breve.'
    if (!hasImage) errors.imagen = 'Sube una imagen para la tarjeta.'
  }
  return errors
}

function Field({ id, label, hint, error, count, limit, children }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className="adm-field" data-invalid={Boolean(error)}>
      <label className="adm-label" htmlFor={id}>
        {label}
        {limit && (
          <small className="adm-count" data-over={count > limit} aria-live="polite">
            {count}/{limit}
          </small>
        )}
      </label>
      {children(describedBy)}
      {hint && !error && (
        <span id={`${id}-hint`} className="adm-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="adm-error">
          <IconAlert /> {error}
        </span>
      )}
    </div>
  )
}

function PostEditor({ post, onBack, onSaved }) {
  const toast = useToast()
  const isNew = !post
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(post ? pickForm(post) : {}) }))
  const [image, setImage] = useState(() =>
    post?.imagenBlob
      ? { original: post.originalBlob || post.imagenBlob, cropped: post.imagenBlob, crop: post.crop || DEFAULT_CROP, natural: post.natural }
      : null
  )
  const [pending, setPending] = useState(null) // imagen en el recortador
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(null) // 'borrador' | 'publicado'
  const [dragOver, setDragOver] = useState(false)
  const [previewTab, setPreviewTab] = useState('eventos')
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [applyingCrop, setApplyingCrop] = useState(false)
  const fileInputRef = useRef(null)
  const dateInputRef = useRef(null)
  const summaryRef = useRef(null)
  const [baseline, setBaseline] = useState(() => JSON.stringify(form))
  const [imageDirty, setImageDirty] = useState(false)

  // Conservar el último contenido del recortador mientras el diálogo anima su salida
  const lastPending = useRef(null)
  if (pending) lastPending.current = pending
  const shownPending = pending || lastPending.current

  const croppedUrl = useObjectUrl(image?.cropped)
  const pendingUrl = useObjectUrl(shownPending?.blob)

  const dirty = JSON.stringify(form) !== baseline || imageDirty

  // Avisar antes de cerrar la pestaña con cambios sin guardar
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    // Tras el primer intento, los errores se corrigen en vivo
    if (submitted) {
      setErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  /* ---------------------------- Imagen ---------------------------- */

  const openFile = async (file) => {
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      toast('Ese formato no es compatible. Usa una imagen JPG, PNG o WebP.', 'error')
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast(`La imagen pesa más de ${MAX_FILE_MB} MB. Elige una más liviana.`, 'error')
      return
    }
    const url = URL.createObjectURL(file)
    try {
      const img = await loadImage(url)
      setPending({ blob: file, natural: { w: img.naturalWidth, h: img.naturalHeight }, crop: { ...DEFAULT_CROP }, isNew: true })
    } catch {
      toast('No se pudo abrir la imagen. Prueba con otro archivo.', 'error')
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const editCrop = async () => {
    if (!image) return
    let natural = image.natural
    if (!natural) {
      const url = URL.createObjectURL(image.original)
      const img = await loadImage(url)
      URL.revokeObjectURL(url)
      natural = { w: img.naturalWidth, h: img.naturalHeight }
    }
    setPending({ blob: image.original, natural, crop: { ...image.crop }, isNew: false })
  }

  const applyCrop = async () => {
    if (!pending || !pendingUrl) return
    setApplyingCrop(true)
    try {
      const img = await loadImage(pendingUrl)
      const cropped = await renderCrop(img, pending.crop)
      setImage({ original: pending.blob, cropped, crop: pending.crop, natural: pending.natural })
      setImageDirty(true)
      setErrors((prev) => {
        const next = { ...prev }
        delete next.imagen
        return next
      })
      setPending(null)
    } catch {
      toast('No se pudo recortar la imagen. Inténtalo de nuevo.', 'error')
    } finally {
      setApplyingCrop(false)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImageDirty(true)
  }

  /* ---------------------------- Guardar ---------------------------- */

  const save = async (estado) => {
    setSubmitted(true)
    const found = validate(form, Boolean(image), estado)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setSaving(estado)
    const now = Date.now()
    const record = {
      ...(post || {}),
      ...form,
      titulo: form.titulo.trim(),
      id: post?.id || newId(form.titulo),
      estado,
      imagenBlob: image?.cropped || null,
      originalBlob: image?.original || null,
      crop: image?.crop || null,
      natural: image?.natural || null,
      createdAt: post?.createdAt || now,
      updatedAt: now,
    }
    try {
      await savePost(record)
      setBaseline(JSON.stringify(form))
      setImageDirty(false)
      toast(estado === 'publicado' ? 'Publicación publicada.' : 'Borrador guardado.')
      onSaved(record)
    } catch {
      toast('No se pudo guardar. Revisa el espacio disponible del navegador e inténtalo de nuevo.', 'error')
    } finally {
      setSaving(null)
    }
  }

  const goBack = () => (dirty ? setConfirmLeave(true) : onBack())

  const errorList = Object.entries(errors)
  const previewPost = useMemo(() => form, [form])

  const actions = (
    <>
      <button type="button" className="adm-btn" onClick={() => save('borrador')} disabled={Boolean(saving)} data-busy={saving === 'borrador'}>
        <span className="adm-btn__label">
          {saving === 'borrador' && <span className="adm-spinner" aria-hidden="true" />}
          Guardar borrador
        </span>
      </button>
      <button
        type="button"
        className="adm-btn adm-btn--primary"
        onClick={() => save('publicado')}
        disabled={Boolean(saving)}
        data-busy={saving === 'publicado'}
      >
        <span className="adm-btn__label">
          {saving === 'publicado' && <span className="adm-spinner" aria-hidden="true" />}
          {post?.estado === 'publicado' ? 'Guardar y publicar' : 'Publicar'}
        </span>
      </button>
    </>
  )

  return (
    <>
      <div className="adm-pagehead">
        <div>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm adm-back" onClick={goBack}>
            <IconArrowLeft /> Publicaciones
          </button>
          <h1>{isNew ? 'Nueva publicación' : 'Editar publicación'}</h1>
          <p>Completa los datos y revisa a la derecha cómo se verá la tarjeta en el sitio.</p>
        </div>
      </div>

      <div className="adm-editor">
        <form className="adm-editor__form" onSubmit={(e) => e.preventDefault()} noValidate>
          {errorList.length > 0 && (
            <div ref={summaryRef} className="adm-errsummary" role="alert" tabIndex={-1}>
              <h2>Revisa {errorList.length === 1 ? 'este campo' : `estos ${errorList.length} campos`}</h2>
              <ul>
                {errorList.map(([key, msg]) => (
                  <li key={key}>
                    <a href={`#adm-f-${key}`}>
                      {FIELD_NAMES[key] || key}: {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Imagen */}
          <section className="adm-panel" aria-labelledby="adm-s-imagen">
            <h2 id="adm-s-imagen">Imagen</h2>
            <p>Se recorta en formato horizontal. Puedes mover y acercar la foto para elegir qué parte se muestra.</p>

            {image ? (
              <div className="adm-imagecard">
                <div className="adm-imagecard__thumb">{croppedUrl && <img src={croppedUrl} alt="Imagen recortada" />}</div>
                <div className="adm-imagecard__info">
                  <p>Así quedará la imagen en la tarjeta de portada. En otras secciones se ve la franja central.</p>
                  <div>
                    <button id="adm-f-imagen" type="button" className="adm-btn adm-btn--sm adm-btn--primary" onClick={editCrop}>
                      <IconCrop /> Ajustar encuadre
                    </button>
                    <button type="button" className="adm-btn adm-btn--sm" onClick={() => fileInputRef.current?.click()}>
                      <IconUpload /> Cambiar imagen
                    </button>
                    <button type="button" className="adm-btn adm-btn--sm adm-btn--ghost" onClick={removeImage}>
                      <IconTrash /> Quitar
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    hidden
                    onChange={(e) => {
                      openFile(e.target.files?.[0])
                      e.target.value = ''
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="adm-field" data-invalid={Boolean(errors.imagen)}>
                <label
                  className="adm-drop"
                  data-over={dragOver}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    openFile(e.dataTransfer.files?.[0])
                  }}
                  style={errors.imagen ? { borderColor: 'var(--error)' } : undefined}
                >
                  <input
                    id="adm-f-imagen"
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    aria-describedby={errors.imagen ? 'adm-imagen-error' : undefined}
                    onChange={(e) => {
                      openFile(e.target.files?.[0])
                      e.target.value = ''
                    }}
                  />
                  <span className="adm-drop__icon">{dragOver ? <IconUpload /> : <IconImage />}</span>
                  <strong>{dragOver ? 'Suelta la imagen aquí' : 'Sube una imagen'}</strong>
                  <small>Arrástrala o haz clic para elegirla. JPG, PNG o WebP de hasta {MAX_FILE_MB} MB.</small>
                </label>
                {errors.imagen && (
                  <span id="adm-imagen-error" className="adm-error">
                    <IconAlert /> {errors.imagen}
                  </span>
                )}
              </div>
            )}
          </section>

          {/* Contenido */}
          <section className="adm-panel" aria-labelledby="adm-s-contenido">
            <h2 id="adm-s-contenido">Contenido</h2>
            <p>El título y el resumen aparecen en la tarjeta; la descripción, al abrirla.</p>
            <div className="adm-panel__grid">
              <div className="adm-span">
                <Field id="adm-f-titulo" label="Título" error={errors.titulo} count={form.titulo.length} limit={LIMITS.titulo}>
                  {(describedBy) => (
                    <input
                      id="adm-f-titulo"
                      className="adm-input adm-slab"
                      value={form.titulo}
                      onChange={set('titulo')}
                      placeholder="Ej. Solemne Fiesta Patronal en honor a San Jerónimo"
                      aria-describedby={describedBy}
                      aria-invalid={Boolean(errors.titulo)}
                    />
                  )}
                </Field>
              </div>
              <div className="adm-span">
                <Field
                  id="adm-f-resumen"
                  label="Resumen"
                  hint="Dos o tres líneas. En la tarjeta se corta a partir de la tercera."
                  error={errors.resumen}
                  count={form.resumen.length}
                  limit={LIMITS.resumen}
                >
                  {(describedBy) => (
                    <textarea
                      id="adm-f-resumen"
                      className="adm-textarea"
                      rows={3}
                      value={form.resumen}
                      onChange={set('resumen')}
                      aria-describedby={describedBy}
                      aria-invalid={Boolean(errors.resumen)}
                    />
                  )}
                </Field>
              </div>
              <div className="adm-span">
                <Field id="adm-f-descripcion" label={<>Descripción completa <small>Opcional</small></>} hint="Se muestra en la ventana de detalle. Respeta los saltos de línea.">
                  {(describedBy) => (
                    <textarea
                      id="adm-f-descripcion"
                      className="adm-textarea adm-slab"
                      rows={6}
                      value={form.descripcion}
                      onChange={set('descripcion')}
                      aria-describedby={describedBy}
                      style={{ fontSize: 15 }}
                    />
                  )}
                </Field>
              </div>
            </div>
          </section>

          {/* Detalles */}
          <section className="adm-panel" aria-labelledby="adm-s-detalles">
            <h2 id="adm-s-detalles">Detalles del evento</h2>
            <p>Puedes escribir fechas libres, como «Todo este mes» o «Primer jueves de cada mes».</p>
            <div className="adm-panel__grid">
              <Field id="adm-f-categoria" label="Categoría" error={errors.categoria}>
                {(describedBy) => (
                  <select
                    id="adm-f-categoria"
                    className="adm-select"
                    value={form.categoria}
                    onChange={set('categoria')}
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(errors.categoria)}
                  >
                    <option value="">Elige una categoría</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field id="adm-f-fecha" label="Fecha" error={errors.fecha}>
                {(describedBy) => (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      id="adm-f-fecha"
                      className="adm-input"
                      value={form.fecha}
                      onChange={set('fecha')}
                      placeholder="Ej. 30 de Septiembre"
                      aria-describedby={describedBy}
                      aria-invalid={Boolean(errors.fecha)}
                    />
                    <button
                      type="button"
                      className="adm-btn adm-btn--icon"
                      aria-label="Elegir fecha en el calendario"
                      onClick={() => {
                        const el = dateInputRef.current
                        if (el?.showPicker) el.showPicker()
                        else el?.click()
                      }}
                    >
                      <IconCalendar />
                    </button>
                    <input
                      ref={dateInputRef}
                      type="date"
                      tabIndex={-1}
                      aria-hidden="true"
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                      onChange={(e) => {
                        const value = formatFecha(e.target.value)
                        if (value) set('fecha')({ target: { value } })
                      }}
                    />
                  </div>
                )}
              </Field>
              <Field id="adm-f-hora" label="Horario" error={errors.hora}>
                {(describedBy) => (
                  <input
                    id="adm-f-hora"
                    className="adm-input"
                    value={form.hora}
                    onChange={set('hora')}
                    placeholder="Ej. 10:00 AM"
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(errors.hora)}
                  />
                )}
              </Field>
              <Field id="adm-f-lugar" label="Lugar" error={errors.lugar}>
                {(describedBy) => (
                  <input
                    id="adm-f-lugar"
                    className="adm-input"
                    value={form.lugar}
                    onChange={set('lugar')}
                    placeholder="Ej. Templo Matriz y Plaza Mayor"
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(errors.lugar)}
                  />
                )}
              </Field>
              <Field id="adm-f-organizador" label={<>Organiza <small>Opcional</small></>}>
                {(describedBy) => (
                  <input
                    id="adm-f-organizador"
                    className="adm-input"
                    value={form.organizador}
                    onChange={set('organizador')}
                    placeholder="Ej. Pastoral Juvenil Parroquial"
                    aria-describedby={describedBy}
                  />
                )}
              </Field>
              <Field
                id="adm-f-etiqueta"
                label={<>Etiqueta <small>Opcional</small></>}
                hint="Aparece junto a la categoría en la portada."
                error={errors.etiqueta}
              >
                {(describedBy) => (
                  <input
                    id="adm-f-etiqueta"
                    className="adm-input"
                    value={form.etiqueta}
                    onChange={set('etiqueta')}
                    placeholder="Ej. Inscripciones abiertas"
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(errors.etiqueta)}
                  />
                )}
              </Field>
            </div>
          </section>

          {/* Visibilidad */}
          <section className="adm-panel" aria-labelledby="adm-s-visibilidad">
            <h2 id="adm-s-visibilidad">Visibilidad</h2>
            <p>Las publicaciones destacadas se muestran en el carrusel de la página de inicio.</p>
            <label className="adm-switch">
              <input type="checkbox" checked={form.destacado} onChange={set('destacado')} />
              <span className="adm-switch__track">
                <span className="adm-switch__thumb" />
              </span>
              <span className="adm-switch__text">
                <strong>Destacar en la portada</strong>
                <span>{form.destacado ? 'Aparecerá en la página de inicio.' : 'Solo aparecerá en Publicaciones.'}</span>
              </span>
            </label>
          </section>
        </form>

        <aside className="adm-editor__aside" aria-label="Vista previa">
          <div className="adm-preview">
            <div className="adm-preview__head">
              <h2>Vista previa</h2>
              <Segmented
                role="tablist"
                label="Sección del sitio"
                value={previewTab}
                onChange={setPreviewTab}
                options={[
                  { value: 'eventos', label: 'Eventos' },
                  { value: 'portada', label: 'Portada' },
                  { value: 'detalle', label: 'Detalle' },
                ]}
              />
            </div>
            <div className="adm-preview__stage">
              <div key={previewTab} className="adm-preview__scale adm-swap" role="tabpanel">
                {previewTab === 'eventos' && <EventoCardPreview post={previewPost} imageUrl={croppedUrl} />}
                {previewTab === 'portada' && <PortadaCardPreview post={previewPost} imageUrl={croppedUrl} />}
                {previewTab === 'detalle' && <DetalleCardPreview post={previewPost} imageUrl={croppedUrl} />}
              </div>
            </div>
            <p className="adm-preview__note">
              {previewTab === 'eventos' && 'Tarjeta de la sección Publicaciones › Eventos.'}
              {previewTab === 'portada' && (form.destacado ? 'Tarjeta del carrusel de inicio.' : 'Activa «Destacar en la portada» para que aparezca aquí.')}
              {previewTab === 'detalle' && 'Ventana que se abre al pulsar «Ver Información Completa».'}
            </p>
          </div>
          <div className="adm-editor__actions">{actions}</div>
        </aside>
      </div>

      <div className="adm-mobilebar">{actions}</div>

      {/* Recortador */}
      <Dialog
        open={Boolean(pending)}
        onClose={() => !applyingCrop && setPending(null)}
        wide
        labelledBy="adm-crop-title"
        title="Ajustar encuadre"
        description="Elige qué parte de la foto se verá en el sitio."
        footer={
          <>
            <button type="button" className="adm-btn" onClick={() => setPending(null)} disabled={applyingCrop}>
              Cancelar
            </button>
            <button type="button" className="adm-btn adm-btn--primary" onClick={applyCrop} disabled={applyingCrop} data-busy={applyingCrop}>
              <span className="adm-btn__label">
                {applyingCrop && <span className="adm-spinner" aria-hidden="true" />}
                Aplicar encuadre
              </span>
            </button>
          </>
        }
      >
        {shownPending && pendingUrl && (
          <ImageCropper
            src={pendingUrl}
            natural={shownPending.natural}
            value={shownPending.crop}
            onChange={(crop) => setPending((p) => (p ? { ...p, crop } : p))}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={confirmLeave}
        title="¿Salir sin guardar?"
        description="Los cambios de esta publicación se perderán."
        confirmLabel="Salir sin guardar"
        onClose={() => setConfirmLeave(false)}
        onConfirm={() => {
          setConfirmLeave(false)
          onBack()
        }}
      />
    </>
  )
}

function pickForm(post) {
  const out = {}
  for (const key of Object.keys(EMPTY)) out[key] = post[key] ?? EMPTY[key]
  return out
}

export default PostEditor
