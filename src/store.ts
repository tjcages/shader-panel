import type { ShaderDevPrompt } from "./prompts"
import type { ShaderDevFieldDef, ShaderDevPanelSide, ShaderDevWriteResult } from "./types"

export type ShaderDevValues = Record<string, unknown>

export type ShaderDevRegistration<T extends ShaderDevValues = ShaderDevValues> = {
  id: string
  title: string
  /** Which side of the viewport the panel docks to. Default `"right"`. */
  side?: ShaderDevPanelSide
  values: T
  defaults: T
  fields: ShaderDevFieldDef<T>[]
  onChange: (next: T) => void
  onWriteConfig?: (values: T) => Promise<ShaderDevWriteResult>
  writeLabel?: string
  /**
   * Override the default AI-prompt rail at the top of the panel. Pass `[]`
   * to hide it entirely. Omit to use the built-in `DEFAULT_SHADER_DEV_PROMPTS`.
   */
  prompts?: ReadonlyArray<ShaderDevPrompt>
  /**
   * Persist uniform values to `localStorage["shader-dev:<id>"]`. Defaults to
   * `true`. Section expand/collapse is always persisted when `id` is set,
   * even if `persist: false` (so hosts can use their own value storage).
   */
  persist?: boolean
  /** Handlers for `type: "action"` fields, keyed by `actionId`. */
  actionHandlers?: Record<string, () => void>
}

const registrations = new Map<string, ShaderDevRegistration>()
let activeLeftId: string | null = null
let activeRightId: string | null = null
let lastRegisteredId: string | null = null
const listeners = new Set<() => void>()
let snapshotRevision = 0

function registrationSide(reg: ShaderDevRegistration): ShaderDevPanelSide {
  return reg.side ?? "right"
}

function notify(): void {
  snapshotRevision += 1
  for (const listener of listeners) listener()
}

function promoteActiveForSide(side: ShaderDevPanelSide): void {
  const remaining = Array.from(registrations.values()).filter(
    (reg) => registrationSide(reg) === side,
  )
  const nextId = remaining.length ? remaining[remaining.length - 1].id : null
  if (side === "left") activeLeftId = nextId
  else activeRightId = nextId
}

/**
 * Register (or replace) a shader with the dev panel.
 *
 * Returns an unregister function — store it as the effect cleanup:
 * ```tsx
 * useEffect(() => registerShaderDev({...}), [config])
 * ```
 *
 * Passing `null` is a legacy no-arg cleanup: it removes the most recently
 * registered shader. Prefer returning the cleanup function or calling
 * `unregisterShaderDev(id)` explicitly.
 */
export function registerShaderDev<T extends ShaderDevValues>(
  next: ShaderDevRegistration<T> | null,
): () => void {
  if (next === null) {
    if (lastRegisteredId !== null) {
      unregisterShaderDev(lastRegisteredId)
    }
    return () => {}
  }

  const reg = next as ShaderDevRegistration
  const side = registrationSide(reg)
  registrations.set(reg.id, reg)
  lastRegisteredId = reg.id

  if (side === "left") {
    if (activeLeftId === null || !registrations.has(activeLeftId)) {
      activeLeftId = reg.id
    }
  } else if (activeRightId === null || !registrations.has(activeRightId)) {
    activeRightId = reg.id
  }

  notify()
  return () => unregisterShaderDev(reg.id)
}

/** Remove a registration by id. No-op if id isn't registered. */
export function unregisterShaderDev(id: string): void {
  const reg = registrations.get(id)
  const had = registrations.delete(id)
  if (!had || !reg) return
  if (lastRegisteredId === id) lastRegisteredId = null
  const side = registrationSide(reg)
  if (side === "left" && activeLeftId === id) promoteActiveForSide("left")
  if (side === "right" && activeRightId === id) promoteActiveForSide("right")
  notify()
}

/** Switch which registered shader the panel shows on the given side. */
export function setActiveShaderDev(id: string): void {
  const reg = registrations.get(id)
  if (!reg) return
  const side = registrationSide(reg)
  if (side === "left") {
    if (activeLeftId === id) return
    activeLeftId = id
  } else {
    if (activeRightId === id) return
    activeRightId = id
  }
  notify()
}

export function getActiveShaderDevId(): string | null {
  return activeRightId ?? activeLeftId
}

export function getActiveShaderDevIdForSide(
  side: ShaderDevPanelSide,
): string | null {
  return side === "left" ? activeLeftId : activeRightId
}

export function getActiveShaderDev(): ShaderDevRegistration | null {
  if (activeRightId) return registrations.get(activeRightId) ?? null
  if (activeLeftId) return registrations.get(activeLeftId) ?? null
  return null
}

export function getActiveShaderDevForSide(
  side: ShaderDevPanelSide,
): ShaderDevRegistration | null {
  const id = getActiveShaderDevIdForSide(side)
  return id ? (registrations.get(id) ?? null) : null
}

/** Snapshot of the registration map. */
export function getShaderDevRegistrations(): ReadonlyMap<
  string,
  ShaderDevRegistration
> {
  return registrations
}

export function getShaderDevRegistrationsForSide(
  side: ShaderDevPanelSide,
): ShaderDevRegistration[] {
  return Array.from(registrations.values()).filter(
    (reg) => registrationSide(reg) === side,
  )
}

/**
 * Monotonically incrementing counter — useful as a `useSyncExternalStore`
 * snapshot when you want to subscribe to "anything changed", not a specific
 * registration.
 */
export function getShaderDevRevision(): number {
  return snapshotRevision
}

/** @deprecated Use `getActiveShaderDev` */
export function getShaderDevRegistration(): ShaderDevRegistration | null {
  return getActiveShaderDev()
}

export function subscribeShaderDevRegistration(
  listener: () => void,
): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
