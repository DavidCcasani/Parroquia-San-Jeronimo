import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function extractPreviewFromNef(buf) {
  const order = buf.toString('ascii', 0, 2)
  const le = order === 'II'
  const readU16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o))
  const readU32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o))

  let bestJpeg = null
  const visited = new Set()

  function parseIFD(offset) {
    if (!offset || offset >= buf.length - 2 || visited.has(offset)) return
    visited.add(offset)

    const count = readU16(offset)
    if (count > 500) return

    let jpegOffset = 0
    let jpegLength = 0
    const subIfds = []

    for (let i = 0; i < count; i++) {
      const entryOffset = offset + 2 + i * 12
      if (entryOffset + 12 > buf.length) break

      const tag = readU16(entryOffset)
      const numValues = readU32(entryOffset + 4)
      const valOffset = entryOffset + 8

      if (tag === 0x014a || tag === 0x8769) {
        if (numValues === 1) {
          subIfds.push(readU32(valOffset))
        } else {
          const ptr = readU32(valOffset)
          for (let j = 0; j < numValues; j++) {
            if (ptr + j * 4 + 4 <= buf.length) {
              subIfds.push(readU32(ptr + j * 4))
            }
          }
        }
      }

      if (tag === 0x0201) jpegOffset = readU32(valOffset)
      if (tag === 0x0202) jpegLength = readU32(valOffset)
    }

    if (jpegOffset > 0 && jpegLength > 0 && jpegOffset + jpegLength <= buf.length) {
      if (buf[jpegOffset] === 0xff && buf[jpegOffset + 1] === 0xd8) {
        if (!bestJpeg || jpegLength > bestJpeg.length) {
          bestJpeg = buf.subarray(jpegOffset, jpegOffset + jpegLength)
        }
      }
    }

    const nextIfdOffsetPos = offset + 2 + count * 12
    if (nextIfdOffsetPos + 4 <= buf.length) {
      const nextIfd = readU32(nextIfdOffsetPos)
      if (nextIfd) subIfds.push(nextIfd)
    }

    for (const sub of subIfds) {
      parseIFD(sub)
    }
  }

  parseIFD(readU32(4))
  return bestJpeg
}

function nefImagesPlugin() {
  const imagesDir = path.resolve(process.cwd(), 'public/imagenes')

  function processAllNefFiles() {
    if (!fs.existsSync(imagesDir)) return []
    const files = fs.readdirSync(imagesDir)
    const imageList = []

    for (const file of files) {
      const ext = path.extname(file).toLowerCase()
      if (ext === '.nef') {
        const baseName = path.basename(file, path.extname(file))
        const jpgName = `${baseName}.jpg`
        const jpgPath = path.join(imagesDir, jpgName)
        const nefPath = path.join(imagesDir, file)

        if (!fs.existsSync(jpgPath)) {
          const buf = fs.readFileSync(nefPath)
          const jpeg = extractPreviewFromNef(buf)
          if (jpeg) {
            fs.writeFileSync(jpgPath, jpeg)
          }
        }
        if (fs.existsSync(jpgPath)) {
          imageList.push(`/imagenes/${jpgName}`)
        }
      } else if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
        const baseName = path.basename(file, path.extname(file))
        if (baseName.toLowerCase().includes('logo')) continue

        const hasNef = files.some(
          (f) =>
            path.extname(f).toLowerCase() === '.nef' &&
            path.basename(f, path.extname(f)).toLowerCase() === baseName.toLowerCase()
        )
        if (!hasNef) {
          imageList.push(`/imagenes/${file}`)
        }
      }
    }
    return imageList
  }

  return {
    name: 'vite-plugin-nef-images',
    buildStart() {
      processAllNefFiles()
    },
    configureServer(server) {
      server.middlewares.use('/api/imagenes', (_req, res) => {
        const list = processAllNefFiles()
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(list))
      })
    },
    resolveId(id) {
      if (id === 'virtual:imagenes') return '\0virtual:imagenes'
    },
    load(id) {
      if (id === '\0virtual:imagenes') {
        const list = processAllNefFiles()
        return `export default ${JSON.stringify(list)};`
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nefImagesPlugin()],
})
