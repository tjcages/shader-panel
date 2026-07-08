"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { mountPanelOverlay, unmountPanelOverlay } from "../panel/auto-overlay"
import { loadPersistedPanelValues } from "../persist"
import {
  registerPanel,
  unregisterPanel,
  type PanelRegistration,
  type PanelState,
} from "../store"
import type { PanelTheme } from "./use-theme"

export type UsePanelOptions<T extends PanelState> = Omit<
  PanelRegistration<T>,
  "values" | "onChange"
> & {
  /**
   * Auto-inject the panel into <body> so you don't render <PanelRoot/>
   * yourself. Default `true`. Set `false` if you mount the root manually.
   */
  autoMount?: boolean
  /** Initial theme passed to the auto-mounted panel. */
  defaultTheme?: PanelTheme
  /**
   * Open the panel by default the first time it mounts this session. Once the
   * user toggles it, their choice sticks (persisted in sessionStorage). Only
   * honored when `autoMount` is true. Default `false`.
   */
  defaultOpen?: boolean
}

/**
 * One-call shader dev panel. Owns the config state, registers with the panel,
 * and (by default) injects the panel UI for you — no `<PanelRoot/>`, no
 * separate files.
 *
 * ```tsx
 * const [config] = usePanel({
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
export function usePanel<T extends PanelState>(
  options: UsePanelOptions<T>,
): [T, (next: T) => void] {
  const {
    id,
    defaults,
    persist,
    autoMount = true,
    defaultTheme,
    defaultOpen,
  } = options

  const [values, setValues] = useState<T>(() =>
    persist === false
      ? ({ ...defaults } as T)
      : loadPersistedPanelValues(id, defaults),
  )

  // Latest options for the registration without re-subscribing every render.
  const optionsRef = useRef(options)
  optionsRef.current = options

  // Keep the registry in sync with the latest fields / handlers / values.
  // Re-registering with the same id just replaces the entry — no flicker.
  useLayoutEffect(() => {
    const o = optionsRef.current
    registerPanel<T>({
      ...o,
      values,
      onChange: setValues,
    })
  })

  // Unregister once on unmount, and own the auto-mounted overlay lifecycle.
  useEffect(() => {
    if (autoMount) mountPanelOverlay(defaultTheme, defaultOpen)
    return () => {
      unregisterPanel(optionsRef.current.id)
      if (autoMount) unmountPanelOverlay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [values, setValues]
}
