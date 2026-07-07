/** Default step size for frame-step buttons (≈ one 30 fps frame). */
export const SHADER_DEV_ANIMATION_STEP = 1 / 30

export type ShaderDevAnimationSnapshot = {
  playing: boolean
  /** Elapsed animation time in seconds. */
  time: number
  /** Playback rate multiplier (1 = realtime). */
  rate: number
}

let playing = true
let time = 0
let rate = 1
let revision = 0
let rafId = 0
let lastRafAt = 0

/** Cached snapshot — getSnapshot must return a stable reference between updates. */
let cachedRevision = -1
let cachedSnapshot: ShaderDevAnimationSnapshot = {
  playing: true,
  time: 0,
  rate: 1,
}

const listeners = new Set<() => void>()

function notify(): void {
  revision += 1
  for (const listener of listeners) listener()
}

function tick(now: number): void {
  if (!playing) return
  const dt = (now - lastRafAt) / 1000
  lastRafAt = now
  if (dt > 0 && dt < 0.5) {
    time += dt * rate
    notify()
  }
  rafId = requestAnimationFrame(tick)
}

function ensureLoop(): void {
  if (typeof requestAnimationFrame === "undefined") return
  if (rafId !== 0) return
  lastRafAt = performance.now()
  rafId = requestAnimationFrame(tick)
}

function stopLoop(): void {
  if (rafId !== 0) cancelAnimationFrame(rafId)
  rafId = 0
}

export function playShaderDevAnimation(): void {
  if (playing) return
  playing = true
  lastRafAt = performance.now()
  notify()
  ensureLoop()
}

export function pauseShaderDevAnimation(): void {
  if (!playing) return
  playing = false
  stopLoop()
  notify()
}

export function toggleShaderDevAnimation(): void {
  if (playing) pauseShaderDevAnimation()
  else playShaderDevAnimation()
}

export function stepShaderDevAnimationForward(
  step = SHADER_DEV_ANIMATION_STEP,
): void {
  time += step
  notify()
}

export function stepShaderDevAnimationBackward(
  step = SHADER_DEV_ANIMATION_STEP,
): void {
  time = Math.max(0, time - step)
  notify()
}

export function resetShaderDevAnimation(): void {
  time = 0
  notify()
}

export function setShaderDevAnimationTime(next: number): void {
  time = Math.max(0, next)
  notify()
}

export function setShaderDevAnimationRate(next: number): void {
  rate = Math.max(0.01, Math.min(8, next))
  notify()
}

export function getShaderDevAnimationSnapshot(): ShaderDevAnimationSnapshot {
  if (revision !== cachedRevision) {
    cachedRevision = revision
    cachedSnapshot = { playing, time, rate }
  }
  return cachedSnapshot
}

export function getShaderDevAnimationTime(): number {
  return time
}

export function getShaderDevAnimationRevision(): number {
  return revision
}

export function subscribeShaderDevAnimation(listener: () => void): () => void {
  listeners.add(listener)
  if (playing) ensureLoop()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) stopLoop()
  }
}

/**
 * Sample animation delta since the previous call. Intended for use inside
 * r3f `useFrame` (or any per-frame tick). Respects play/pause and manual
 * step/seek from the dev panel.
 */
export function advanceShaderDevAnimationDelta(previousTime: number): {
  time: number
  delta: number
} {
  const nextTime = getShaderDevAnimationTime()
  const delta = Math.min(Math.max(0, nextTime - previousTime), 0.1)
  return { time: nextTime, delta }
}

/** Start the animation clock — called when the panel mounts. */
export function initShaderDevAnimationClock(): void {
  if (playing) ensureLoop()
}
