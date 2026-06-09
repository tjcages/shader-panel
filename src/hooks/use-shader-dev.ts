"use client"

import { useEffect, useRef, useState } from "react"
import { mountShaderDevOverlay, unmountShaderDevOverlay } from "../panel/auto-overlay"
import { loadPersistedShaderDevValues } from "../persist"
import {
  registerShaderDev,
  unregisterShaderDev,
  type ShaderDevRegistration,
  type ShaderDevValues,
} from "../store"
import type { ShaderDevTheme } from "./use-theme"

export type UseShaderDevOptions<T extends ShaderDevValues> = Omit<
  ShaderDevRegistration<T>,
  "values" | "onChange"
> & {
  /**
   * Auto-inject the panel into <body> so you don't render <ShaderDevRoot/>
   * yourself. Default `true`. Set `false` if you mount the root manually.
   */
  autoMount?: boolean
  /** Initial theme passed to the auto-mounted panel. */
  defaultTheme?: ShaderDevTheme
}

/**
 * One-call shader dev panel. Owns the config state, registers with the panel,
 * and (by default) injects the panel UI for you — no `<ShaderDevRoot/>`, no
 * separate files.
 *
 * ```tsx
 * const [config] = useShaderDev({
 *   id: "my-shader",
 *   title: "My shader",
 *   defaults: DEFAULTS,
 *   fields: FIELDS,
 * })
 * // feed `config` to your shader
 * ```
 *
 * Returns a `useState`-style tuple so you can also set values yourself (e.g.
 * from props). Edits persist to localStorage and rehydrate on reload unless
 * `persist: false`.
 */
export function useShaderDev<T extends ShaderDevValues>(
  options: UseShaderDevOptions<T>,
): [T, (next: T) => void] {
  const { id, defaults, persist, autoMount = true, defaultTheme } = options

  const [values, setValues] = useState<T>(() =>
    persist === false
      ? ({ ...defaults } as T)
      : loadPersistedShaderDevValues(id, defaults),
  )

  // Latest options for the registration without re-subscribing every render.
  const optionsRef = useRef(options)
  optionsRef.current = options

  // Register / update on every value change. We do NOT return the unregister
  // cleanup here — re-registering with the same id just replaces the entry, so
  // there's no flicker. Unregistering on each tick would.
  useEffect(() => {
    const o = optionsRef.current
    registerShaderDev<T>({
      ...o,
      values,
      onChange: setValues,
    })
  }, [values])

  // Unregister once on unmount, and own the auto-mounted overlay lifecycle.
  useEffect(() => {
    if (autoMount) mountShaderDevOverlay(defaultTheme)
    return () => {
      unregisterShaderDev(optionsRef.current.id)
      if (autoMount) unmountShaderDevOverlay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [values, setValues]
}
