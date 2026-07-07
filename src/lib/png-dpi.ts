/** PNG signature bytes. */
const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])

let crcTable: Uint32Array | null = null

function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable
  crcTable = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    crcTable[n] = c >>> 0
  }
  return crcTable
}

function crc32(bytes: Uint8Array): number {
  const table = getCrcTable()
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i += 1) {
    crc = table[(crc ^ bytes[i]!) & 0xff]! ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function readChunkType(data: Uint8Array, offset: number): string {
  return String.fromCharCode(
    data[offset]!,
    data[offset + 1]!,
    data[offset + 2]!,
    data[offset + 3]!,
  )
}

function isPng(data: Uint8Array): boolean {
  if (data.length < PNG_SIGNATURE.length) return false
  for (let i = 0; i < PNG_SIGNATURE.length; i += 1) {
    if (data[i] !== PNG_SIGNATURE[i]) return false
  }
  return true
}

function createPhysChunk(dpi: number): Uint8Array {
  const ppm = Math.max(1, Math.round(dpi / 0.0254))
  const chunkData = new Uint8Array(9)
  const view = new DataView(chunkData.buffer)
  view.setUint32(0, ppm, false)
  view.setUint32(4, ppm, false)
  chunkData[8] = 1

  const type = new TextEncoder().encode("pHYs")
  const crcInput = new Uint8Array(type.length + chunkData.length)
  crcInput.set(type, 0)
  crcInput.set(chunkData, type.length)

  const out = new Uint8Array(4 + 4 + chunkData.length + 4)
  const outView = new DataView(out.buffer)
  outView.setUint32(0, chunkData.length, false)
  out.set(type, 4)
  out.set(chunkData, 8)
  outView.setUint32(8 + chunkData.length, crc32(crcInput), false)
  return out
}

/**
 * Insert or replace a PNG pHYs chunk so viewers report the given DPI.
 * Returns the original blob unchanged when parsing fails.
 */
export async function embedPngDpi(blob: Blob, dpi: number): Promise<Blob> {
  if (!Number.isFinite(dpi) || dpi <= 0) return blob

  const input = new Uint8Array(await blob.arrayBuffer())
  if (!isPng(input)) return blob

  const chunks: Uint8Array[] = []
  let offset = PNG_SIGNATURE.length
  let inserted = false

  while (offset + 8 <= input.length) {
    const view = new DataView(input.buffer, input.byteOffset + offset)
    const length = view.getUint32(0, false)
    const type = readChunkType(input, offset + 4)
    const total = 12 + length
    if (offset + total > input.length) break

    const chunk = input.slice(offset, offset + total)

    if (type === "pHYs") {
      offset += total
      continue
    }

    chunks.push(chunk)

    if (!inserted && type === "IHDR") {
      chunks.push(createPhysChunk(dpi))
      inserted = true
    }

    offset += total
  }

  if (!inserted) return blob

  const out = new Uint8Array(
    PNG_SIGNATURE.length + chunks.reduce((sum, c) => sum + c.length, 0),
  )
  out.set(PNG_SIGNATURE, 0)
  let write = PNG_SIGNATURE.length
  for (const chunk of chunks) {
    out.set(chunk, write)
    write += chunk.length
  }

  return new Blob([out], { type: "image/png" })
}

/** Longest-edge pixels for a print width/height at the given DPI. */
export function printMaxEdgePx(
  widthInches: number,
  heightInches: number,
  dpi: number,
): number {
  return Math.max(
    Math.round(widthInches * dpi),
    Math.round(heightInches * dpi),
  )
}
