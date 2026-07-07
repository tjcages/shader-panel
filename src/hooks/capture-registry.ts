"use client"

/**
 * Optional high-resolution capture hook. The export panel has no handle on a
 * shader's renderer, so a shader page (e.g. an r3f `<Canvas>`) can register a
 * function that re-renders the current frame at an arbitrary pixel size and
 * returns it as a PNG blob. When none is registered, the panel falls back to
 * reading the visible canvas at screen resolution.
 *
 * `maxEdge` is the requested longest-edge pixel count; the registrant is
 * expected to clamp it to the GPU's real limit and preserve aspect ratio.
 */
export type ShaderCaptureFn = (opts: { maxEdge: number }) => Promise<Blob>

let current: ShaderCaptureFn | null = null
const listeners = new Set<() => void>()

export function registerShaderCapture(fn: ShaderCaptureFn | null): () => void {
  current = fn
  for (const l of listeners) l()
  return () => {
    if (current === fn) {
      current = null
      for (const l of listeners) l()
    }
  }
}

export function getShaderCapture(): ShaderCaptureFn | null {
  return current
}

export function subscribeShaderCapture(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
