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

export type ShaderGifExportOptions = {
  durationSec: number
  fps: number
  maxEdge: number
  onProgress?: (progress: number) => void
}

export type ShaderGifExportFn = (
  opts: ShaderGifExportOptions,
) => Promise<Blob>

/**
 * Host-owned video recording. The panel only starts/stops — capture + encode
 * live entirely in the host (same model as GIF export).
 */
export type ShaderVideoSession = {
  stop: () => Promise<Blob>
}

export type ShaderVideoExportFn = () => Promise<ShaderVideoSession>

type ShaderRecordCanvasGetter = () => HTMLCanvasElement | null
type ShaderRecordPrepareFn = () => Promise<void>
/**
 * Host paints one composite frame into the record canvas. Called by the
 * WebCodecs recorder immediately before each encode so capture stays in sync
 * with the live scene (same idea as GIF frame capture).
 */
export type ShaderRecordFrameFn = () => void | Promise<void>

export type ShaderRecordingOptions = {
  /**
   * When true, the host should continuously composite (MediaRecorder /
   * captureStream). WebCodecs uses per-frame `registerShaderRecordFrame`
   * instead and should leave this false.
   */
  continuous?: boolean
}

let current: ShaderCaptureFn | null = null
let gifExport: ShaderGifExportFn | null = null
let videoExport: ShaderVideoExportFn | null = null
let recordCanvasGetter: ShaderRecordCanvasGetter | null = null
let recordPrepare: ShaderRecordPrepareFn | null = null
let recordFrame: ShaderRecordFrameFn | null = null
let recording = false
let recordingContinuous = false
const captureListeners = new Set<() => void>()
const recordingListeners = new Set<
  (recording: boolean, opts: { continuous: boolean }) => void
>()

function notifyCaptureListeners() {
  for (const listener of captureListeners) listener()
}

function notifyRecordingListeners(next: boolean) {
  recording = next
  if (!next) recordingContinuous = false
  const opts = { continuous: recordingContinuous }
  for (const listener of recordingListeners) listener(next, opts)
}

export function registerShaderCapture(fn: ShaderCaptureFn | null): () => void {
  current = fn
  notifyCaptureListeners()
  return () => {
    if (current === fn) {
      current = null
      notifyCaptureListeners()
    }
  }
}

export function getShaderCapture(): ShaderCaptureFn | null {
  return current
}

export function subscribeShaderCapture(listener: () => void): () => void {
  captureListeners.add(listener)
  return () => captureListeners.delete(listener)
}

export function registerShaderRecordCanvas(
  getter: ShaderRecordCanvasGetter | null,
): () => void {
  recordCanvasGetter = getter
  return () => {
    if (recordCanvasGetter === getter) recordCanvasGetter = null
  }
}

export function getShaderRecordCanvas(): HTMLCanvasElement | null {
  return recordCanvasGetter?.() ?? null
}

export function registerShaderRecordPrepare(
  fn: ShaderRecordPrepareFn | null,
): () => void {
  recordPrepare = fn
  return () => {
    if (recordPrepare === fn) recordPrepare = null
  }
}

export function getShaderRecordPrepare(): ShaderRecordPrepareFn | null {
  return recordPrepare
}

export function registerShaderGifExport(
  fn: ShaderGifExportFn | null,
): () => void {
  gifExport = fn
  return () => {
    if (gifExport === fn) gifExport = null
  }
}

export function getShaderGifExport(): ShaderGifExportFn | null {
  return gifExport
}

export function registerShaderVideoExport(
  fn: ShaderVideoExportFn | null,
): () => void {
  videoExport = fn
  return () => {
    if (videoExport === fn) videoExport = null
  }
}

export function getShaderVideoExport(): ShaderVideoExportFn | null {
  return videoExport
}

export function registerShaderRecordFrame(
  fn: ShaderRecordFrameFn | null,
): () => void {
  recordFrame = fn
  return () => {
    if (recordFrame === fn) recordFrame = null
  }
}

export function getShaderRecordFrame(): ShaderRecordFrameFn | null {
  return recordFrame
}

export function subscribeShaderRecording(
  listener: (
    recording: boolean,
    opts: { continuous: boolean },
  ) => void,
): () => void {
  recordingListeners.add(listener)
  listener(recording, { continuous: recordingContinuous })
  return () => recordingListeners.delete(listener)
}

export function setShaderRecording(
  active: boolean,
  opts?: ShaderRecordingOptions,
): void {
  const nextContinuous = active ? !!opts?.continuous : false
  if (recording === active && recordingContinuous === nextContinuous) return
  recordingContinuous = nextContinuous
  notifyRecordingListeners(active)
}
