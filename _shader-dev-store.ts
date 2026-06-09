import type { ShaderDevPrompt } from "./_default-prompts"
import type { ShaderDevFieldDef, ShaderDevWriteResult } from "./_types"

export type ShaderDevValues = Record<string, unknown>

export type ShaderDevRegistration<T extends ShaderDevValues = ShaderDevValues> = {
  id: string
  title: string
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
   * Persist values to `localStorage["shader-dev:<id>"]` so edits survive page
   * reload. Defaults to `true`. Pair with `loadPersistedShaderDevValues(id,
   * defaults)` as your `useState` initializer to hydrate on mount.
   */
  persist?: boolean
}

const registrations = new Map<string, ShaderDevRegistration>()
let activeId: string | null = null
let lastRegisteredId: string | null = null
const listeners = new Set<() => void>()
let snapshotRevision = 0

function notify(): void {
  snapshotRevision += 1
  for (const listener of listeners) listener()
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
  registrations.set(reg.id, reg)
  lastRegisteredId = reg.id
  if (activeId === null || !registrations.has(activeId)) {
    activeId = reg.id
  }
  notify()
  return () => unregisterShaderDev(reg.id)
}

/** Remove a registration by id. No-op if id isn't registered. */
export function unregisterShaderDev(id: string): void {
  const had = registrations.delete(id)
  if (!had) return
  if (lastRegisteredId === id) lastRegisteredId = null
  if (activeId === id) {
    // Promote the next-most-recent registration to active, or clear if empty.
    const remaining = Array.from(registrations.keys())
    activeId = remaining.length ? remaining[remaining.length - 1] : null
  }
  notify()
}

/** Switch which registered shader the panel shows. */
export function setActiveShaderDev(id: string): void {
  if (activeId === id) return
  if (!registrations.has(id)) return
  activeId = id
  notify()
}

export function getActiveShaderDevId(): string | null {
  return activeId
}

export function getActiveShaderDev(): ShaderDevRegistration | null {
  return activeId ? (registrations.get(activeId) ?? null) : null
}

/** Snapshot of the registration map. */
export function getShaderDevRegistrations(): ReadonlyMap<
  string,
  ShaderDevRegistration
> {
  return registrations
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
