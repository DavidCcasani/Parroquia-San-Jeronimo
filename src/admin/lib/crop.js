// Matemática del recorte. El encuadre se guarda normalizado (independiente del
// tamaño en pantalla), así el resultado exportado coincide con lo que se ve.

// Proporción de la imagen exportada: la de las tarjetas de portada (16:10).
// Eventos y el detalle muestran una franja central de esta misma imagen.
export const CROP_ASPECT = 16 / 10
export const OUTPUT_WIDTH = 1600
export const OUTPUT_HEIGHT = Math.round(OUTPUT_WIDTH / CROP_ASPECT)
export const MIN_ZOOM = 1
export const MAX_ZOOM = 4

// Franja segura: lo que entra aquí se ve en todas las secciones del sitio
// (la ventana de detalle es la más panorámica, ≈ 2.3:1).
export const SAFE_BAND_RATIO = CROP_ASPECT / 2.3

export const DEFAULT_CROP = { x: 0, y: 0, zoom: 1, rotation: 0 }

export function rotatedSize(w, h, rotation) {
  return rotation % 180 === 0 ? { w, h } : { w: h, h: w }
}

// Escala que hace que la imagen cubra el marco por completo (como object-cover).
export function coverScale(natW, natH, frameW, frameH, rotation) {
  const r = rotatedSize(natW, natH, rotation)
  return Math.max(frameW / r.w, frameH / r.h)
}

// Límite de desplazamiento (en fracción del marco) para no dejar bordes vacíos.
export function maxOffset(natW, natH, frameW, frameH, zoom, rotation) {
  const r = rotatedSize(natW, natH, rotation)
  const s = coverScale(natW, natH, frameW, frameH, rotation) * zoom
  return {
    x: Math.max(0, (r.w * s - frameW) / 2 / frameW),
    y: Math.max(0, (r.h * s - frameH) / 2 / frameH),
  }
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function clampCrop(crop, natW, natH) {
  const zoom = clamp(crop.zoom, MIN_ZOOM, MAX_ZOOM)
  // El límite normalizado no depende del tamaño absoluto del marco, solo de su proporción.
  const m = maxOffset(natW, natH, CROP_ASPECT, 1, zoom, crop.rotation)
  return { ...crop, zoom, x: clamp(crop.x, -m.x, m.x), y: clamp(crop.y, -m.y, m.y) }
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo leer la imagen'))
    img.src = src
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function renderCrop(img, crop) {
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_WIDTH
  canvas.height = OUTPUT_HEIGHT
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  const natW = img.naturalWidth
  const natH = img.naturalHeight
  const s = coverScale(natW, natH, OUTPUT_WIDTH, OUTPUT_HEIGHT, crop.rotation) * crop.zoom
  ctx.translate(OUTPUT_WIDTH / 2 + crop.x * OUTPUT_WIDTH, OUTPUT_HEIGHT / 2 + crop.y * OUTPUT_HEIGHT)
  ctx.rotate((crop.rotation * Math.PI) / 180)
  ctx.scale(s, s)
  ctx.drawImage(img, -natW / 2, -natH / 2)

  const webp = await canvasToBlob(canvas, 'image/webp', 0.86)
  if (webp && webp.type === 'image/webp') return webp
  return canvasToBlob(canvas, 'image/jpeg', 0.88)
}
