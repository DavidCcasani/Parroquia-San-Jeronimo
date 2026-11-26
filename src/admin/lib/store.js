// Almacenamiento local de publicaciones (IndexedDB).
// Guarda la imagen recortada y la original para poder reajustar el encuadre.
// Cuando exista un backend, basta con reemplazar estas funciones por llamadas a la API.

const DB_NAME = 'psj-admin'
const DB_VERSION = 1
const STORE = 'publicaciones'

let dbPromise = null

function openDb() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => {
      dbPromise = null
      reject(req.error)
    }
  })
  return dbPromise
}

async function run(mode, fn) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const store = tx.objectStore(STORE)
    const req = fn(store)
    tx.oncomplete = () => resolve(req?.result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function listPosts() {
  const all = (await run('readonly', (s) => s.getAll())) || []
  return all.sort((a, b) => b.updatedAt - a.updatedAt)
}

export function savePost(post) {
  return run('readwrite', (s) => s.put(post))
}

export function deletePost(id) {
  return run('readwrite', (s) => s.delete(id))
}

export function slugify(text) {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'publicacion'
  )
}

export function newId(titulo) {
  return `${slugify(titulo || 'publicacion')}-${Date.now().toString(36)}`
}
